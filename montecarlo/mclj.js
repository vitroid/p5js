// Variables for UI
let sig = 3.63; // AA
let etemp = 231; // Kelvin
let temperature = 200; // K, 温度制御しない時は0に設定
let density = 0.15; // g/cm3

function fcc(N) {
  /*
 FCC 4 N N N lattice ( fractional coordinate )
 math.jsを使おうとおもったが、読めなくなりそうだったのでやめた。
*/
  var NN = 4 * N * N * N;
  var h = 0.5 / N;
  var pos = new Array();
  var i = 0;
  for (var x = 0; x < N; x++) {
    for (var y = 0; y < N; y++) {
      for (var z = 0; z < N; z++) {
        pos.push([x / N, y / N, z / N]);
        pos.push([x / N + h, y / N + h, z / N]);
        pos.push([x / N, y / N + h, z / N + h]);
        pos.push([x / N + h, y / N, z / N + h]);
      }
    }
  }
  return pos;
}

function wrap(x) {
  if (x < -0.5) x += 1.0;
  else if (x > 0.5) x -= 1.0;
  return x;
}

function energy1(m, pos, cell, rc) {
  /*
  分子mとそれ以外との間の相互作用の総和を返す。
*/
  var N = pos.length;
  var epb = new Array(N);
  var vrb = new Array(N);
  var rc2 = rc * rc;
  for (var j = 0; j < N; j++) {
    epb[j] = 0.0;
    vrb[j] = 0.0;
    if (j != m) {
      var rdx = wrap(pos[m][0] - pos[j][0]);
      var dx = rdx * cell[0];
      if (Math.abs(dx) < rc) {
        var rdy = wrap(pos[m][1] - pos[j][1]);
        var dy = rdy * cell[1];
        if (Math.abs(dy) < rc) {
          var rdz = wrap(pos[m][2] - pos[j][2]);
          var dz = rdz * cell[2];
          if (Math.abs(dz) < rc) {
            var rs = dx * dx + dy * dy + dz * dz;
            if (rs < rc2) {
              var rsi = 1 / rs;
              var rh = rsi * rsi * rsi;
              var rdc = rh * rh;
              var ep = rdc - rh;
              var vr = 2 * rdc - rh;
              epb[j] = ep;
              vrb[j] = vr;
            }
          }
        }
      }
    }
  }
  return [epb, vrb];
}

function two_d_array(N, M) {
  var e = new Array(N);
  for (var m = 0; m < N; m++) {
    e[m] = new Array(M);
  }
  return e;
}

const etemp0 = 231.0;
const sig0 = 3.63;

const Navo = 6.02205e23;
const KBol = 1.38066e-16;
const Mmol = 44.0;
const NCL = 4; //lattice size
const NV = 100;
const Nstop = 150; //outer loop

class MCLJ {
  constructor(eps, sigma, density, temperature) {
    //parameters for CO2
    this.densr = density; //g/cm3
    this.tempr = temperature; // K
    this.etemp = eps; // K
    this.sig = sigma; // AA

    this.temp = this.tempr / this.etemp;
    console.log(this.tempr, this.etemp);
    this.dens =
      (this.sig * this.sig * this.sig * this.densr * Navo) / (Mmol * 1e24);

    this.pos = fcc(NCL);
    this.nmol = this.pos.length;
    var vol = this.nmol / this.dens;
    var bxl = Math.pow(vol, 1 / 3);
    this.cell = [bxl, bxl, bxl];
    this.rc = bxl / 2;
    this.emu = Navo * KBol * this.etemp * 1e-10;
    this.emup = (this.emu * 1e-3) / Math.pow(this.sig * 1e-10, 3) / Navo;
    this.ecc =
      Math.PI *
      this.dens *
      ((8 / 9) * Math.pow(this.rc, -9) - (8 / 3) * Math.pow(this.rc, -3));
    this.vcc =
      Math.PI *
      this.dens *
      this.dens *
      ((32 / 9) * Math.pow(this.rc, -9) - (16 / 3) * Math.pow(this.rc, -3));
    this.ul = bxl / (2 * NCL);
    this.dtmaxx = this.ul / 2.0 / this.cell[0];
    this.dtmaxy = this.ul / 2.0 / this.cell[1];
    this.dtmaxz = this.ul / 2.0 / this.cell[2];
    this.nav = NV * this.nmol; //inner loop
    this.tempi = 4.0 / this.temp;

    console.log("Computer Simulation");
    console.log("Monatomic molecules interacting");
    console.log("with Lennard-Jones potential");
    console.log("Particle number=", this.nmol);
    console.log("Steps to be simulated=", Nstop);
    console.log("Temperature=", this.temp);
    console.log("Number density=", this.dens);
    console.log("Cell length=", bxl);
    console.log("Potential truncation=", this.rc);
    console.log("Volume of basic cell=", vol);
    console.log("Maximum translation=", this.ul / 2.0);

    // preset energy and virial
    this.e = two_d_array(this.nmol, this.nmol);
    this.v = two_d_array(this.nmol, this.nmol);
    this.ep = 0.0;
    this.vr = 0.0;

    for (var m = 0; m < this.nmol; m++) {
      var ev = energy1(m, this.pos, this.cell, this.rc);
      var epb = ev[0];
      var vrb = ev[1];
      for (var j = 0; j < this.nmol; j++) {
        this.ep += epb[j];
        this.vr += vrb[j];
        this.e[j][m] = epb[j];
        this.v[j][m] = vrb[j];
      }
    }
    this.ep /= 2;
    this.vr /= 2;

    this.eps = 0.0;
    this.vrs = 0.0;
    this.ept = 0.0;
    this.vrt = 0.0;

    this.loop = 0;
    this.iss = 0;
  }

  loop_manager() {
    if (this.iss == 0) {
      output.innerHTML += "loop || avg pot energy || avg pres.\n\n";
    }
    this.oneMCStep();

    this.ept += this.eps;
    this.vrt += this.vrs;
    this.iss++;
    //average of the inner loop
    var avg_e = (this.ept * 4) / (this.nav * this.nmol * this.iss) + this.ecc;
    var avg_v =
      this.dens *
        (this.temp + (this.vrt * 24) / (this.nav * this.nmol * 3 * this.iss)) +
      this.vcc;

    console.log(this.iss, avg_e * this.emu, avg_v * this.emup);
    output.innerHTML +=
      new String(this.iss) +
      "\t" +
      (avg_e * this.emu).toPrecision(6) +
      "\t" +
      (avg_v * this.emup).toPrecision(6) +
      "\n";

    if (this.iss == Nstop) {
      // show grand average
      var avg_e = (this.ept * 4) / (this.nav * this.nmol * Nstop) + this.ecc;
      var avg_v =
        this.dens *
          (this.temp + (this.vrt * 24) / (this.nav * this.nmol * Nstop * 3)) +
        this.vcc;

      console.log("                     Loop", Nstop * NV);
      console.log("         Density [g /cm3]", this.densr);
      console.log("          Temperature [K]", this.tempr);
      console.log("Potential Energy [kJ/mol]", avg_e * this.emu);
      console.log("           Pressure [MPa]", avg_v * this.emup);
      output.innerHTML += "\n                     Loop " + Nstop * NV + "\n";
      output.innerHTML +=
        "                Sigma [A] " + this.sig.toFixed(2) + "\n";
      output.innerHTML +=
        "           Epsilon/kB [K] " + this.etemp.toFixed(0) + "\n";
      output.innerHTML +=
        "         Density [g /cm3] " + this.densr.toPrecision(6) + "\n";
      output.innerHTML +=
        "          Temperature [K] " + this.tempr.toFixed(1) + "\n";
      output.innerHTML +=
        "Potential Energy [kJ/mol] " + (avg_e * this.emu).toPrecision(6) + "\n";
      output.innerHTML +=
        "           Pressure [MPa] " +
        (avg_v * this.emup).toPrecision(6) +
        "\n\n";
      this.iss = 0;
      this.ept = 0.0;
      this.vrt = 0.0;
      this.loop++;
    }
  }

  oneMCStep() {
    this.eps = 0.0;
    this.vrs = 0.0;

    this.nreject = 0;

    for (var jss = 0; jss < this.nav; jss++) {
      this.oneTrial();
    }

    // adjust the magnitude of displacements
    var rejectratio = this.nreject / this.nav;
    var dispratio = 1.0 + (0.5 - rejectratio) * 0.2;
    this.dtmaxx *= dispratio;
    this.dtmaxy *= dispratio;
    this.dtmaxz *= dispratio;
    redraw();
  }

  oneTrial() {
    var m = Math.floor(Math.random() * this.nmol);
    //var pos0 = pos[m] //is it a copy? or a reference? It's a reference!
    var pos0 = this.pos[m].slice(); // It copies.
    var dx = (Math.random() * 2 - 1) * this.dtmaxx;
    var dy = (Math.random() * 2 - 1) * this.dtmaxy;
    var dz = (Math.random() * 2 - 1) * this.dtmaxz;
    this.pos[m][0] += dx;
    this.pos[m][1] += dy;
    this.pos[m][2] += dz;
    var epbb = 0.0;
    var vrbb = 0.0;
    for (var i = 0; i < this.nmol; i++) {
      epbb += this.e[i][m];
      vrbb += this.v[i][m];
    }
    var ev = energy1(m, this.pos, this.cell, this.rc);
    var epb = ev[0];
    var vrb = ev[1];
    var epaa = 0.0;
    var vraa = 0.0;
    for (var i = 0; i < this.nmol; i++) {
      epaa += epb[i];
      vraa += vrb[i];
    }
    var de = (epbb - epaa) * this.tempi;
    if (de >= 0.0 || de > Math.log(Math.random())) {
      //accept
      this.ep += epaa - epbb;
      this.vr += vraa - vrbb;
      for (var d = 0; d < 3; d++) {
        if (this.pos[m][d] > 1.0) this.pos[m][d] -= 1.0;
        else if (this.pos[m][d] < 0.0) this.pos[m][d] += 1.0;
      }
      for (var i = 0; i < this.nmol; i++) {
        this.e[i][m] = epb[i];
        this.e[m][i] = epb[i];
        this.v[i][m] = vrb[i];
        this.v[m][i] = vrb[i];
      } //120
    } else {
      //reject
      this.nreject++;
      // recover positions
      this.pos[m] = pos0;
    }
    this.eps += this.ep;
    this.vrs += this.vr;
  }
}
