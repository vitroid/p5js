let x = [];
let y = [];
let z = [];
let vx = [];
let vy = [];
let vz = [];
const dt = 10;
const radius = 10.0;
const N = 20;
let cell = [120, 120, 220];

function setup() {
  var canvas = createCanvas(400, 400, WEBGL);
  canvas.parent("sketch-holder");
  frameRate(30);
  normalMaterial();
  cam = createCamera();
  perspective(PI / 5.0, width / height, 0.1, 5000);
  let row = 0;
  let col = 0;
  const xspacing = radius * 2.02;
  const yspacing = (xspacing * Math.sqrt(3)) / 2;
  while (x.length < N) {
    x.push(col * xspacing + 0.01 - cell[0] / 2);
    y.push(row * yspacing + 0.01 - cell[1] / 2);
    z.push(0.01);
    col += 1;
    if (col * xspacing + 0.01 > cell[0]) {
      row += 1;
      col = (row % 2) * 0.5;
      if (row * yspacing + 0.01 > cell[1]) {
        // stop running
        noLoop();
      }
    }
    vx.push(Math.random());
    vy.push(Math.random());
    vz.push(Math.random());
  }
}

const NOCOLL = -1;
const LEFT = -2;
const RIGHT = -3;
const TOP = -4;
const BOTTOM = -5;
const BACK = -6;
const FRONT = -7;
const labels = ["", "", "LEFT", "RIGHT", "TOP", "BOTTOM", "BACK", "FRONT"];
// 時間をdtだけ進める。

// 衝突判定が非常に複雑になる。
// 動きを考えるべき物体が複数あるので、
// いろんな衝突のケースを考える必要がある。
// 壁との衝突と、粒子同士の衝突を分ける。
function wall(dt, x, y, z, vx, vy, vz, last) {
  var collide = NOCOLL;
  var t_coll = dt;
  // 左の壁
  // x + vx*dt == 0 の時に衝突。
  // dt = -x/vx
  if (last != LEFT) {
    let t_left = (-cell[0] / 2 - x) / vx;
    if (0 <= t_left && t_left < t_coll) {
      t_coll = t_left;
      collide = LEFT;
    }
  }
  // 右の壁
  // x + vx*dt == cell[0]の時に衝突
  if (last != RIGHT) {
    let t_right = (cell[0] / 2 - x) / vx;
    if (0 <= t_right && t_right < t_coll) {
      t_coll = t_right;
      collide = RIGHT;
    }
  }
  // 上の壁
  if (last != TOP) {
    let t_top = (-cell[1] / 2 - y) / vy;
    if (0 <= t_top && t_top < t_coll) {
      t_coll = t_top;
      collide = TOP;
    }
  }
  // 下の壁
  if (last != BOTTOM) {
    let t_bottom = (cell[1] / 2 - y) / vy;
    if (0 <= t_bottom && t_bottom < t_coll) {
      t_coll = t_bottom;
      collide = BOTTOM;
    }
  }
  // うしろの壁
  if (last != BACK) {
    let t_back = (-cell[2] / 2 - z) / vz;
    if (0 <= t_back && t_back < t_coll) {
      t_coll = t_back;
      collide = BACK;
    }
  }
  // まえの壁
  if (last != FRONT) {
    let t_front = (cell[2] / 2 - z) / vz;
    if (0 <= t_front && t_front < t_coll) {
      t_coll = t_front;
      collide = FRONT;
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
    let col = wall(dt, x[i], y[i], z[i], vx[i], vy[i], vz[i], lastwall);
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
        let dz = z[i] - z[j];
        // 相対速度
        let wx = vx[i] - vx[j];
        let wy = vy[i] - vy[j];
        let wz = vz[i] - vz[j];
        // 衝突までの時間
        let A = wx ** 2 + wy ** 2 + wz ** 2;
        let B = 2 * (wx * dx + wy * dy + wz * dz);
        let C = dx ** 2 + dy ** 2 + dz ** 2 - 4 * radius ** 2;
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
  console.log(t_coll);
  // t_collには最初の衝突までの時間、collideには衝突相手の番号が入っている。
  // 衝突までの時間よりもdtのほうが小さい場合は、dtだけ進める。
  if (t_coll > dt) {
    for (let i = 0; i < N; i++) {
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
      z[i] += vz[i] * dt;
    }
    return last;
  }
  // t_collだけ進める。
  for (let i = 0; i < N; i++) {
    x[i] += vx[i] * t_coll;
    y[i] += vy[i] * t_coll;
    z[i] += vz[i] * t_coll;
  }
  dt -= t_coll;
  // 衝突した場合は、相手によって速度の向きを変える。
  if (obj1 != NOCOLL) {
    if (obj1 == BOTTOM || obj1 == TOP) {
      vy[obj2] = -vy[obj2];
    } else if (obj1 == LEFT || obj1 == RIGHT) {
      vx[obj2] = -vx[obj2];
    } else if (obj1 == BACK || obj1 == FRONT) {
      vz[obj2] = -vz[obj2];
    } else {
      // 粒子同士の衝突。
      // t_collだけ進んだので、球は距離2rの位置にある。
      // 2者をつなぐベクトルの方向の速度成分を反転させる。
      let dx = (x[obj1] - x[obj2]) / (2 * radius);
      let dy = (y[obj1] - y[obj2]) / (2 * radius);
      let dz = (z[obj1] - z[obj2]) / (2 * radius);
      // 相対速度の法線成分
      let norm =
        (vx[obj1] - vx[obj2]) * dx +
        (vy[obj1] - vy[obj2]) * dy +
        (vz[obj1] - vz[obj2]) * dz;
      vx[obj1] -= norm * dx;
      vy[obj1] -= norm * dy;
      vz[obj1] -= norm * dz;
      vx[obj2] += norm * dx;
      vy[obj2] += norm * dy;
      vz[obj2] += norm * dz;
    }
    return progress(dt, [obj1, obj2]);
  }
  return last;
}

let last = [NOCOLL, NOCOLL];

function draw() {
  const N = x.length;
  last = progress(dt, last);
  console.log(last);
  // 表示

  background(200);
  cam.lookAt(0, 0, 0);
  cam.setPosition(0, 0, 400);
  setCamera(cam);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  stroke(0);
  noFill();
  push();
  scale(cell[0], cell[1], cell[2]);
  box(1);
  pop();
  noStroke();
  // shininess(0)
  fill(100, 0, 0);
  ambientLight(100, 100, 100);
  ambientMaterial(255, 0, 0);
  pointLight(255, 255, 255, 1000, -1000, 1000);
  specularMaterial(100);
  for (let i = 0; i < N; i++) {
    push();
    translate(x[i], y[i], z[i]);
    sphere(radius);
    pop();
  }

  // textSize(10)
  // fill(0)
  // let msg = ""
  // if (last[0] < 0){
  //     msg = labels[-last[0]] + "-" + last[1]
  // }
  // else{
  //     msg = last[0] + "-" + last[1]
  // }
  // text(msg, 0, 10)
}
