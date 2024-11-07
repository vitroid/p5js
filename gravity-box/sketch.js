const mass = 0.3;
const mass0 = 10;
const dt = 0.1;
const G = 10000;

let x = 100.0;
let y = 100.0;
let vx = 10.0;
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
  let d = Math.sqrt(deltax ** 2 + deltay ** 2);
  let forcex = (-G * mass * mass0 * deltax) / d ** 3;
  let forcey = (-G * mass * mass0 * deltay) / d ** 3;
  // 移動
  vx = vx + (forcex / mass) * dt;
  vy = vy + (forcey / mass) * dt;
  let newx = x + vx * dt;
  // 箱の壁まできたら反射する
  if (newx < 0 || newx > width) {
    vx = -vx;
    newx = x + vx * dt;
  }
  let newy = y + vy * dt;
  if (newy < 0 || newy > height) {
    vy = -vy;
    newy = y + vy * dt;
  }
  x = newx;
  y = newy;
  // 表示
  background(200);
  stroke(0);
  line(x, y, mouseX, mouseY);
  fill(255);
  ellipse(x, y, 20, 20);
  ellipse(mouseX, mouseY, 50, 50);
}
