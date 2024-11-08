let x = 10.0;
let y = 0.1;
let vx = Math.random();
let vy = Math.random();
const dt = 10;
const radius = 10.0;

function setup() {
  var canvas = createCanvas(141, 100);
  canvas.parent("sketch-holder");
  frameRate(1);
}

const NOCOLL = -1;
const LEFT = -2;
const RIGHT = -3;
const TOP = -4;
const BOTTOM = -5;
const labels = ["", "", "LEFT", "RIGHT", "TOP", "BOTTOM"];

// 時間をdtだけ進める。
// 壁との衝突の可能性を考える。
// lastは、直前の衝突相手。lastとの衝突は考えなくていい。
// 返り値は最後に衝突した壁の番号。
function progress(dt, last) {
  if (dt <= 0) {
    return last;
  }
  var collide = NOCOLL;
  var t_coll = dt;
  // 左の壁
  // x + vx*dt == 0 の時に衝突。
  // dt = -x/vx
  if (last != LEFT) {
    let t_left = -x / vx;
    if (0 <= t_left) {
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
  // t_collには最初の衝突までの時間、collideには衝突相手の番号が入っている。
  // 衝突までの時間よりもdtのほうが小さい場合は、dtだけ進める。
  if (t_coll > dt) {
    x += vx * dt;
    y += vy * dt;
    return last;
  }
  x += vx * t_coll;
  y += vy * t_coll;
  dt -= t_coll;
  // 衝突した場合は、相手によって速度の向きを変える。
  if (collide != NOCOLL) {
    if (collide == BOTTOM || collide == TOP) {
      vy = -vy;
    } else if (collide == LEFT || collide == RIGHT) {
      vx = -vx;
    }
    return progress(dt, collide);
  }
  return last;
}

let last = NOCOLL;

function draw() {
  last = progress(dt, last);
  // 表示
  background(200);
  stroke(0);
  fill(255);
  ellipse(x, y, radius * 2, radius * 2);

  fill(0);
  noStroke();
  textSize(10);
  text(labels[-last], 0, 10);
}
