let x = [];
let y = [];
let vx = [];
let vy = [];
const dt = 1 / 30;
const radius = 6.0;
const N = 10; //nine balls
const colors = [
  "white",
  "yellow",
  "orange",
  "green",
  "blue",
  "yellow",
  "purple",
  "brown",
  "black",
  "red",
];

function setup() {
  var canvas = createCanvas(163, 290);
  canvas.parent("sketch-holder");
  frameRate(30);

  // 初期配置と初速の設定
  const xspacing = radius * 2.02;
  const yspacing = (xspacing * Math.sqrt(3)) / 2;
  const xcenter = 163 / 2;
  const ycenter = 290 / 4;
  x.push(xcenter);
  y.push(290 - ycenter);
  var r = Date.now() / 1000;
  r -= int(r);
  vx.push((r - 0.5) * 0.01);
  vy.push(-200); // pool shot speed 2 m/s
  for (let row = -2; row <= 2; row++) {
    const ncol = 3 - abs(row);
    for (let col = 0; col < ncol; col++) {
      let rx = xcenter + xspacing * (col - (ncol - 1) / 2);
      let ry = ycenter + yspacing * row;
      x.push(rx);
      y.push(ry);
      vx.push(0);
      vy.push(0);
    }
  }
}

const NOCOLL = -1;
const LEFT = -2;
const RIGHT = -3;
const TOP = -4;
const BOTTOM = -5;
const labels = ["", "", "LEFT", "RIGHT", "TOP", "BOTTOM"];
// 時間をdtだけ進める。

// 衝突判定が非常に複雑になる。
// 動きを考えるべき物体が複数あるので、
// いろんな衝突のケースを考える必要がある。
// 壁との衝突と、粒子同士の衝突を分ける。
function wall(dt, x, y, vx, vy, last) {
  var collide = NOCOLL;
  var t_coll = dt;
  // 左の壁
  // x + vx*dt == 0 の時に衝突。
  // dt = -x/vx
  if (last != LEFT) {
    let t_left = -x / vx;
    if (0 <= t_left && t_left < t_coll) {
      t_coll = t_left;
      collide = LEFT;
    }
  }
  // 右の壁
  // x + vx*dt == widthの時に衝突
  if (last != RIGHT) {
    let t_right = (width - x) / vx;
    if (0 <= t_right && t_right < t_coll) {
      t_coll = t_right;
      collide = RIGHT;
    }
  }
  // 上の壁
  if (last != TOP) {
    let t_top = -y / vy;
    if (0 <= t_top && t_top < t_coll) {
      t_coll = t_top;
      collide = TOP;
    }
  }
  // 下の壁
  if (last != BOTTOM) {
    let t_bottom = (height - y) / vy;
    if (0 <= t_bottom && t_bottom < t_coll) {
      t_coll = t_bottom;
      collide = BOTTOM;
    }
  }
  return [t_coll, collide];
}

// lastは2要素の配列。最後に衝突したペア。
function progress(dt, last) {
  // dt < 0 なら何もしない。
  if (dt <= 0) {
    return last;
  }
  let obj1 = NOCOLL;
  let obj2 = NOCOLL;
  let t_coll = dt;
  const N = x.length;

  // 壁との衝突のうち、最初のものをさがす。
  for (let i = 0; i < N; i++) {
    let lastwall = last[0];
    if (last[1] != i) {
      lastwall = NOCOLL;
    }
    let col = wall(dt, x[i], y[i], vx[i], vy[i], lastwall);
    let tc = col[0];
    let obj = col[1];
    if (0 <= tc && tc < t_coll) {
      obj1 = obj;
      obj2 = i;
      t_coll = tc;
    }
  }

  // 粒子同士の衝突をさがす。
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      if (!(i == last[0] && j == last[1])) {
        // 相対位置
        let dx = x[i] - x[j];
        let dy = y[i] - y[j];
        // 相対速度
        let wx = vx[i] - vx[j];
        let wy = vy[i] - vy[j];
        // 衝突までの時間
        let A = wx ** 2 + wy ** 2;
        let B = 2 * (wx * dx + wy * dy);
        let C = dx ** 2 + dy ** 2 - 4 * radius ** 2;
        let D = B ** 2 - 4 * A * C;
        if (D > 0) {
          let t_pair = (-B - Math.sqrt(D)) / (2 * A);
          if (0 <= t_pair && t_pair < t_coll) {
            t_coll = t_pair;
            obj1 = i;
            obj2 = j;
          }
        }
      }
    }
  }
  // t_collには最初の衝突までの時間、collideには衝突相手の番号が入っている。
  // 衝突までの時間よりもdtのほうが小さい場合は、dtだけ進める。
  if (t_coll > dt) {
    for (let i = 0; i < N; i++) {
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
    }
    return last;
  }
  // t_collだけ進める。
  for (let i = 0; i < N; i++) {
    x[i] += vx[i] * t_coll;
    y[i] += vy[i] * t_coll;
  }
  dt -= t_coll;
  // 衝突した場合は、相手によって速度の向きを変える。
  if (obj1 != NOCOLL) {
    if (obj1 == BOTTOM || obj1 == TOP) {
      vy[obj2] = -vy[obj2];
    } else if (obj1 == LEFT || obj1 == RIGHT) {
      vx[obj2] = -vx[obj2];
    } else {
      // 粒子同士の衝突。
      // t_collだけ進んだので、球は距離2rの位置にある。
      // 2者をつなぐベクトルの方向の速度成分を反転させる。
      let dx = (x[obj1] - x[obj2]) / (2 * radius);
      let dy = (y[obj1] - y[obj2]) / (2 * radius);
      // 相対速度の法線成分
      let norm = (vx[obj1] - vx[obj2]) * dx + (vy[obj1] - vy[obj2]) * dy;
      vx[obj1] -= norm * dx;
      vy[obj1] -= norm * dy;
      vx[obj2] += norm * dx;
      vy[obj2] += norm * dy;
    }
    return progress(dt, [obj1, obj2]);
  }
  return last;
}

let last = [NOCOLL, NOCOLL];

function draw() {
  const N = x.length;
  last = progress(dt, last);
  // 摩擦
  for (let i = 0; i < N; i++) {
    vx[i] *= 0.994;
    vy[i] *= 0.994;
  }
  // 表示
  background(200);
  stroke(0);
  for (let i = 0; i < N; i++) {
    fill(colors[i]);
    ellipse(x[i], y[i], radius * 2, radius * 2);
  }

  fill(0);
  noStroke();
  let msg = "";
  if (last[0] < 0) {
    msg = labels[-last[0]] + "-" + last[1];
  } else {
    msg = last[0] + "-" + last[1];
  }
  textSize(10);
  text(msg, 0, 10);
}
