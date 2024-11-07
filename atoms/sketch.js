const sig = 50;
const eps = 100.0;
const dt = 0.003;
const N = 20;
const T = 50;

let x = Array(N);
let y = Array(N);
let vx = Array(N);
let vy = Array(N);
let mass = Array(N);

function arrange_atoms() {
  let X = 1;
  let row = 0;
  let xspacing = sig * 1.02;
  let yspacing = (xspacing * Math.sqrt(3)) / 2;
  let Y = sig * 0.02;
  for (let i = 0; i < N; i++) {
    x[i] = X;
    y[i] = Y;
    X += xspacing;
    if (X > width) {
      row += 1;
      X = ((row % 2) * xspacing) / 2;
      Y += yspacing;
    }
    vx[i] = 0;
    vy[i] = random() * 100 - 50;
    mass[i] = 1.0;
  }
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");
  frameRate(30);
  arrange_atoms();
}

function force_LJ(x, y, x2, y2) {
  let dx = x2 - x;
  let dy = y2 - y;
  if (dx >= width / 2) {
    dx -= width;
  } else if (dx < -width / 2) {
    dx += width;
  }
  if (dy >= height / 2) {
    dy -= height;
  } else if (dy < -height / 2) {
    dy += height;
  }
  let d2 = dx ** 2 + dy ** 2;
  let f =
    (4 * eps * ((-12 * sig ** 12) / d2 ** 6 + (6 * sig ** 6) / d2 ** 3)) / d2;
  return [f * dx, f * dy];
}

function energy_LJ(x, y, x2, y2) {
  let dx = x2 - x;
  let dy = y2 - y;
  if (dx >= width / 2) {
    dx -= width;
  } else if (dx < -width / 2) {
    dx += width;
  }
  if (dy >= height / 2) {
    dy -= height;
  } else if (dy < -height / 2) {
    dy += height;
  }
  let d2 = dx ** 2 + dy ** 2;
  return 4 * eps * (sig ** 12 / d2 ** 6 - sig ** 6 / d2 ** 3);
}

let epp = [];
let ekk = [];

function draw() {
  for (let loop = 0; loop < 100; loop++) {
    // 移動
    for (let i = 0; i < N; i++) {
      x[i] += (vx[i] * dt) / 2;
      y[i] += (vy[i] * dt) / 2;
    }
    // 力の計算
    let fx = Array(N);
    let fy = Array(N);
    for (let i = 0; i < N; i++) {
      fx[i] = fy[i] = 0;
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < i; j++) {
        f = force_LJ(x[i], y[i], x[j], y[j]);
        fx[i] += f[0];
        fy[i] += f[1];
        fx[j] -= f[0];
        fy[j] -= f[1];
      }
    }
    // 移動
    for (let i = 0; i < N; i++) {
      vx[i] += (fx[i] / mass[i]) * dt;
      vy[i] += (fy[i] / mass[i]) * dt;
      x[i] += (vx[i] * dt) / 2;
      y[i] += (vy[i] * dt) / 2;
      if (x[i] >= width) {
        x[i] -= width;
      } else if (x[i] < 0) {
        x[i] += width;
      }
      if (y[i] >= height) {
        y[i] -= height;
      } else if (y[i] < 0) {
        y[i] += height;
      }
    }
  }
  // // エネルギー計算
  let ep = 0;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      ep += energy_LJ(x[i], y[i], x[j], y[j]);
    }
  }
  let ek = 0;
  for (let i = 0; i < N; i++) {
    ek += (mass[i] * (vx[i] ** 2 + vy[i] ** 2)) / 2;
  }
  epp.push(ep);
  ekk.push(ek);
  if (epp.length > width) {
    epp.shift(0);
    ekk.shift(0);
  }
  // 温度制御
  if (ek / N > T) {
    for (let i = 0; i < N; i++) {
      vx[i] *= 0.99;
      vy[i] *= 0.99;
    }
  }
  // 表示
  background(200);
  // ポテンシャルエネルギーの表示
  stroke(0, 0, 255, 100);
  for (let i = 0; i < epp.length; i++) {
    line(i, height / 2, i, height / 2 - epp[i] / 30);
  }
  // 運動エネルギーの表示
  stroke(255, 0, 0, 100);
  for (let i = 0; i < epp.length; i++) {
    line(i, height / 2, i, height / 2 - ekk[i] / 30);
  }
  // 全エネルギーの表示
  noStroke();
  fill(0);
  for (let i = 0; i < epp.length; i++) {
    ellipse(i, height / 2 - (epp[i] + ekk[i]) / 30, 2, 2);
  }
  stroke(0);
  fill(255);
  for (let i = 0; i < N; i++) {
    ellipse(x[i], y[i], 50, 50);
  }
}
