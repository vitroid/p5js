const mass = 0.3;
const dt = 0.1;
const k = 0.1;

let x = 0.0;
let y = 0.0;
let vx = 0.0;
let vy = 0.0;

function setup() {
  var canvas = createCanvas(600, 600);
  canvas.parent("sketch-holder");
  frameRate(30);
}
function draw() {
  // 力の計算
  let deltax = x - mouseX;
  let deltay = y - mouseY;
  let forcex = -deltax * k;
  let forcey = -deltay * k;
  // 移動
  vx = vx + (forcex / mass) * dt;
  vy = vy + (forcey / mass) * dt;
  x = x + vx * dt;
  y = y + vy * dt;
  // 表示
  background(200);
  stroke(0);
  line(x, y, mouseX, mouseY);
  fill(255);
  ellipse(x, y, 20, 20);
}
