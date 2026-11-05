const N = 10;
const dt = 0.1;

let x = new Array(N).fill(0);
let y = new Array(N).fill(0);
let vx = new Array(N).fill(0);
let vy = new Array(N).fill(0);
let mass = new Array(N).fill(0.3);
let k = new Array(N).fill(1);

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");
  frameRate(30);
}
function draw() {
  // 力の計算
  let forcex = new Array(N).fill(0);
  let forcey = new Array(N).fill(0);
  let deltax = x[0] - mouseX;
  let deltay = y[0] - mouseY;
  forcex[0] = -deltax * k[0];
  forcey[0] = -deltay * k[0];
  for (let i = 1; i < N; i++) {
    deltax = x[i] - x[i - 1];
    deltay = y[i] - y[i - 1];
    forcex[i] = -deltax * k[i];
    forcey[i] = -deltay * k[i];
    forcex[i - 1] += deltax * k[i];
    forcey[i - 1] += deltay * k[i];
  }
  // 移動
  for (let i = 0; i < N; i++) {
    vx[i] += (forcex[i] / mass[i]) * dt;
    vy[i] += (forcey[i] / mass[i]) * dt;
    x[i] += vx[i] * dt;
    y[i] += vy[i] * dt;
  }
  // 表示
  background(200);
  stroke(0);
  line(x[0], y[0], mouseX, mouseY);
  for (let i = 1; i < N; i++) {
    line(x[i], y[i], x[i - 1], y[i - 1]);
  }
  fill(255);
  for (let i = 0; i < N; i++) {
    ellipse(x[i], y[i], 20, 20);
  }
}
