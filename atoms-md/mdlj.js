// 単位をきちんとする。
const Navogadro = 6.022e23;
const Kboltzmann = 1.38e-23;
const Rgas = Navogadro * Kboltzmann; // J / mol / K

// Variables for UI
let sig = 0.363 * 1000; // pm
let eps = 231; // Kelvin
let Temperature = 200; // K, 温度制御しない時は0に設定
let Density = 0.15; // g/cm3

class MDLJ {
  fcc(NCL) {
    this.x = [];
    this.y = [];
    this.z = [];
    // 分子の初期配置と初期速度。
    // 配置は重なら速度はランダム。
    for (let ix = 0; ix < NCL; ix++) {
      for (let iy = 0; iy < NCL; iy++) {
        for (let iz = 0; iz < NCL; iz++) {
          this.x.push(ix);
          this.y.push(iy);
          this.z.push(iz);
          this.x.push(ix + 0.5);
          this.y.push(iy + 0.5);
          this.z.push(iz);
          this.x.push(ix + 0.5);
          this.y.push(iy);
          this.z.push(iz + 0.5);
          this.x.push(ix);
          this.y.push(iy + 0.5);
          this.z.push(iz + 0.5);
        }
      }
    }
    for (let i = 0; i < this.N; i++) {
      this.x[i] /= NCL;
      this.y[i] /= NCL;
      this.z[i] /= NCL;
    }
  }

  constructor(eps, sigma, density, temperature) {
    this.densr = density;
    this.tempr = temperature;
    this.eps = eps;
    this.sig = sigma;

    this.mass = 44e-3; // atomic mass in kg / mol

    this.dt = 0.01; // ps

    this.numdens = (((this.densr * 1e-3) / this.mass) * Navogadro) / 1e30; // 数密度、個/pm3

    const NCL = 4;
    this.N = 4 * NCL ** 3;
    const volume = this.N / this.numdens; // pm3
    const L = volume ** (1 / 3);
    this.cell = [L, L, L];

    this.vx = Array(this.N);
    this.vy = Array(this.N);
    this.vz = Array(this.N);
    this.fcc(NCL);
    for (let i = 0; i < this.N; i++) {
      this.x[i] *= this.cell[0];
      this.y[i] *= this.cell[1];
      this.z[i] *= this.cell[2];
      this.vx[i] = Math.random() * 500 - 250;
      this.vy[i] = Math.random() * 500 - 250;
      this.vz[i] = Math.random() * 500 - 250;
    }

    // for the bar graph
    this.epp = [];
    this.ekk = [];

    // 統計
    this.accum_ep = 0;
    this.accum_vr = 0;
    this.accum_ek = 0;
    this.naccum = 0;

    // loop control
    this.steps = 0;
    // number of steps in a stage
    this.Nstep = 10000;
    // visualization interval
    this.vsteps = 10;
    // logging interval
    this.lsteps = 100;
    // 1st stage is for equiliburation, second stage is for the product run.
    this.stage = 2;
  }

  force_LJ(x, y, z, x2, y2, z2) {
    // 座標から、力を算出する。
    // 力の単位は、J / mol / pm
    let dx = x2 - x;
    let dy = y2 - y;
    let dz = z2 - z;
    // 周期境界条件の処理
    dx -= floor(dx / this.cell[0] + 0.5) * this.cell[0];
    dy -= floor(dy / this.cell[1] + 0.5) * this.cell[1];
    dz -= floor(dz / this.cell[2] + 0.5) * this.cell[2];
    let d2 = dx * dx + dy * dy + dz * dz;
    let d6 = d2 * d2 * d2;
    let d12 = d6 * d6;
    let f =
      (4 *
        this.eps *
        Rgas *
        ((-12 * this.sig ** 12) / d2 ** 6 + (6 * this.sig ** 6) / d2 ** 3)) /
      d2;
    let virial = f * d2;
    return [f * dx, f * dy, f * dz, virial];
  }

  energy_LJ(x, y, z, x2, y2, z2) {
    // 座標から、エネルギーを算出する。
    // 単位は、J / mol
    let dx = x2 - x;
    let dy = y2 - y;
    let dz = z2 - z;
    dx -= floor(dx / this.cell[0] + 0.5) * this.cell[0];
    dy -= floor(dy / this.cell[1] + 0.5) * this.cell[1];
    dz -= floor(dz / this.cell[2] + 0.5) * this.cell[2];
    let d2 = dx * dx + dy * dy + dz * dz;
    let d6 = d2 * d2 * d2;
    let d12 = d6 * d6;
    let epot =
      4 *
      this.eps *
      Rgas *
      (this.sig ** 12 / d2 ** 6 - this.sig ** 6 / d2 ** 3);
    let f =
      (4 *
        this.eps *
        Rgas *
        ((-12 * this.sig ** 12) / d2 ** 6 + (6 * this.sig ** 6) / d2 ** 3)) /
      d2;
    // 圧力の計算に必要
    let virial = f * d2;
    return [epot, virial];
  }

  progress() {
    for (let i = 0; i < this.N; i++) {
      this.x[i] += (this.vx[i] * this.dt) / 2;
      this.y[i] += (this.vy[i] * this.dt) / 2;
      this.z[i] += (this.vz[i] * this.dt) / 2;
    }
    // 力の計算
    let fx = Array(this.N);
    let fy = Array(this.N);
    let fz = Array(this.N);
    for (let i = 0; i < this.N; i++) {
      fx[i] = fy[i] = fz[i] = 0;
    }
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < i; j++) {
        let f = this.force_LJ(
          this.x[i],
          this.y[i],
          this.z[i],
          this.x[j],
          this.y[j],
          this.z[j]
        );
        fx[i] += f[0];
        fy[i] += f[1];
        fz[i] += f[2];
        fx[j] -= f[0];
        fy[j] -= f[1];
        fz[j] -= f[2];
      }
    }
    // 移動
    for (let i = 0; i < this.N; i++) {
      this.vx[i] += (fx[i] / this.mass) * this.dt;
      this.vy[i] += (fy[i] / this.mass) * this.dt;
      this.vz[i] += (fz[i] / this.mass) * this.dt;
      this.x[i] += (this.vx[i] * this.dt) / 2;
      this.y[i] += (this.vy[i] * this.dt) / 2;
      this.z[i] += (this.vz[i] * this.dt) / 2;
    }
  }

  statistics() {
    this.ep = 0;
    this.vr = 0;
    for (let i = 0; i < this.N; i++) {
      for (let j = 0; j < i; j++) {
        let ev = this.energy_LJ(
          this.x[i],
          this.y[i],
          this.z[i],
          this.x[j],
          this.y[j],
          this.z[j]
        );
        this.ep += ev[0];
        this.vr += ev[1];
      }
    }
    this.ep /= this.N; // J / mol
    this.vr /= this.N;
    this.ek = 0;
    for (let i = 0; i < this.N; i++) {
      this.ek +=
        (this.mass * (this.vx[i] ** 2 + this.vy[i] ** 2 + this.vz[i] ** 2)) / 2;
    }
    this.ek /= this.N;

    this.accum_ep += this.ep;
    this.accum_ek += this.ek;
    this.accum_vr += this.vr;
    this.naccum += 1;

    // for the bar graph
    this.epp.push(this.ep);
    this.ekk.push(this.ek);
    if (this.epp.length > 60) {
      this.epp.shift(0);
      this.ekk.shift(0);
    }
  }

  average_and_clear() {
    let avg_ep = this.accum_ep / this.naccum;
    let avg_ek = this.accum_ek / this.naccum;
    let avg_vr = this.accum_vr / this.naccum;
    this.naccum = 0;
    this.accum_ep = 0;
    this.accum_ek = 0;
    this.accum_vr = 0;
    return [avg_ep, avg_ek, avg_vr];
  }

  thermostat(Ttarget) {
    // ドリフトの解消
    let dr = new Array(3);
    for (let i = 0; i < 3; i++) {
      dr[i] = 0;
    }
    for (let i = 0; i < this.N; i++) {
      dr[0] += this.vx[i];
      dr[1] += this.vy[i];
      dr[2] += this.vz[i];
    }
    dr[0] /= this.N;
    dr[1] /= this.N;
    dr[2] /= this.N;
    for (let i = 0; i < this.N; i++) {
      this.vx[i] -= dr[0];
      this.vy[i] -= dr[1];
      this.vz[i] -= dr[2];
    }
    // 温度制御
    var ratio = this.ek > (3 / 2) * Ttarget * Rgas ? 0.99 : 1.01;
    for (let i = 0; i < this.N; i++) {
      this.vx[i] *= ratio;
      this.vy[i] *= ratio;
      this.vz[i] *= ratio;
    }
  }

  collective_progress() {
    for (let loop = 0; loop < this.vsteps; loop++) {
      this.progress();
    }
    this.steps += this.vsteps;

    this.statistics();
    this.thermostat(this.tempr);

    if (this.steps % this.Nstep == 0) {
      this.stage -= 1;
    }
  }
}
