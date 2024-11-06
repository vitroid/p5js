const K = 10.0;
const dt = 0.1;
const N = 2;
const T = 150;
const gravity = 10;
var cell;
let aimx = 3;
let aimy = 4;
let shoot = 100;

var fruits = [];

let safe_margin = 0.01;

var cam;

const fruit_types = [
  { radius: 10, mass: 10, rgb: [0.8, 0, 0] },
  { radius: 12, mass: 0.7, rgb: [0.8, 0.2, 0] },
  { radius: 14, mass: 0.5, rgb: [0.8, 0, 0.8] },
  { radius: 17, mass: 0.35, rgb: [0.7, 0.3, 0] },
  { radius: 20, mass: 0.25, rgb: [1, 0.3, 0] },
];

let nexttype;
// function keyPressed() {
//   console.log(keyCode);
//   // 一旦はなす必要のあるキー
//   if (keyCode == 32) {
//     let fruit = {
//       position: createVector(aimx, aimy, -cell.z),
//       velocitie: createVector(0, 0, 0),
//       force: createVector(0, 0, 0),
//       mass: 1.0,
//       radius: 25,
//     };
//     console.log(keyCode, fruit);
//     fruits.push(fruit);
//   }
// }

function setup() {
  colorMode(RGB, 1, 1, 1);
  cell = createVector(200, 200, 400);
  // positions.push(createVector(0, 0, 0));
  // positions.push(createVector(0, 0, -195));
  // velocities.push(createVector(50, 40, 100));
  // velocities.push(createVector(0, 0, 0));
  // forces.push(createVector(0, 0, 0));
  // forces.push(createVector(0, 0, 0));
  // radii.push(25.0);
  // radii.push(30.0);
  // mass.push(1.0);
  // mass.push(0.7);

  let canvas = createCanvas(600, 600, WEBGL);
  canvas.parent("sketch-holder");
  frameRate(30);
  normalMaterial();
  cam = createCamera();
  perspective(PI / 4.0, width / height, 0.1, 5000);
  cam.lookAt(0, 0, 0);
  // cam.setPosition(0, 1000, 1000);
  setCamera(cam);

  nexttype = int(random(fruit_types.length));
}

function force(pos1, pos2, sig) {
  let d = p5.Vector.sub(pos2, pos1);
  let r = d.dot(d) ** 0.5;
  if (r < sig) {
    let f = (K * (r - sig)) / r;
    return [f * d.x, f * d.y, f * d.z];
  }
  return [0, 0, 0];
}

function draw() {
  shoot += 1;
  // console.log(fruits);
  for (let loop = 0; loop < 10; loop++) {
    let N = fruits.length;
    // console.log(N);
    // 移動 1/2
    for (let i = 0; i < N; i++) {
      fruits[i].position.add(p5.Vector.mult(fruits[i].velocity, dt / 2));
    }
    // 力の計算
    for (let i = 0; i < N; i++) {
      fruits[i].force.set(0, 0, 0);
    }
    // 1. 相互作用
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < i; j++) {
        f = force(
          fruits[i].position,
          fruits[j].position,
          fruit_types[fruits[i].type].radius +
            fruit_types[fruits[j].type].radius
        );
        fruits[i].force.add(f);
        fruits[j].force.sub(f);
      }
    }
    // 2. 重力
    for (let i = 0; i < N; i++) {
      fruits[i].force.add(0, 0, -fruit_types[fruits[i].type].mass * gravity);
    }
    // 3. 壁の反発? 壁に衝突した(座標が壁の向こう側にいった)時には、撃力が加わる。
    // それを足すことで、法線方向の速度が逆転しなければならない。
    for (let i = 0; i < N; i++) {
      if (
        fruits[i].position.x <
        -cell.x / 2 + fruit_types[fruits[i].type].radius + safe_margin
      ) {
        fruits[i].position.x =
          -cell.x / 2 + fruit_types[fruits[i].type].radius + safe_margin;
        fruits[i].force.add(
          (-fruits[i].velocity.x * fruit_types[fruits[i].type].mass * 2) / dt,
          0,
          0
        );
      }
      if (
        fruits[i].position.x >
        cell.x / 2 - fruit_types[fruits[i].type].radius - safe_margin
      ) {
        fruits[i].position.x =
          cell.x / 2 - fruit_types[fruits[i].type].radius - safe_margin;
        fruits[i].force.add(
          (-fruits[i].velocity.x * fruit_types[fruits[i].type].mass * 2) / dt,
          0,
          0
        );
      }
      if (
        fruits[i].position.y <
        -cell.y / 2 + fruit_types[fruits[i].type].radius + safe_margin
      ) {
        fruits[i].position.y =
          -cell.y / 2 + fruit_types[fruits[i].type].radius + safe_margin;
        fruits[i].force.add(
          0,
          (-fruits[i].velocity.y * fruit_types[fruits[i].type].mass * 2) / dt,
          0
        );
      }
      if (
        fruits[i].position.y >
        cell.y / 2 - fruit_types[fruits[i].type].radius - safe_margin
      ) {
        fruits[i].position.y =
          cell.y / 2 - fruit_types[fruits[i].type].radius - safe_margin;
        fruits[i].force.add(
          0,
          (-fruits[i].velocity.y * fruit_types[fruits[i].type].mass * 2) / dt,
          0
        );
      }
      if (
        fruits[i].position.z <
        -cell.z / 2 + fruit_types[fruits[i].type].radius + safe_margin
      ) {
        fruits[i].position.z =
          -cell.z / 2 + fruit_types[fruits[i].type].radius + safe_margin;
        fruits[i].force.add(
          0,
          0,
          (-fruits[i].velocity.z * fruit_types[fruits[i].type].mass * 2) / dt
        );
      }
      // if (fruits[i].position.z > cell.z / 2 - safe_margin) {
      //   fruits[i].position.z = cell.z / 2 - safe_margin;
      //   fruits[i].force.add(0, 0, (-fruits[i].velocity.z * fruit_types[fruits[i].type].mass * 2) / dt);
      // }
    }
    // 4. 摩擦力
    //
    for (let i = 0; i < N; i++) {
      fruits[i].force.sub(p5.Vector.mult(fruits[i].velocity, 0.02));
    }

    // 速度の更新 + 移動 1/2
    for (let i = 0; i < N; i++) {
      fruits[i].velocity.add(
        p5.Vector.mult(fruits[i].force, dt / fruit_types[fruits[i].type].mass)
      );
      fruits[i].position.add(p5.Vector.mult(fruits[i].velocity, dt / 2));
    }
  }

  background(0.6, 0.6, 0.6);

  if (keyIsPressed === true) {
    // console.log(keyCode, aimx);
    if (keyCode === 38) {
      // up
      aimy -= 2;
      if (aimy < -cell.y / 2) {
        aimy = -cell.y / 2;
      }
    }
    if (keyCode === 40) {
      //down
      aimy += 2;
      if (cell.y / 2 < aimy) {
        aimy = cell.y / 2;
      }
    }
    if (keyCode === 37) {
      //left
      aimx -= 2;
      if (aimx < -cell.x / 2) {
        aimx = -cell.x / 2;
      }
    }
    if (keyCode === 39) {
      //right
      aimx += 2;
      if (cell.x / 2 < aimx) {
        aimx = cell.x / 2;
      }
    }
    if (keyCode == 32 && 100 < shoot) {
      let fruit = {
        position: createVector(aimx, aimy, cell.z / 2),
        velocity: createVector(0, 0, 0),
        force: createVector(0, 0, 0),
        type: nexttype,
      };
      // console.log(keyCode, fruit, shoot);
      fruits.push(fruit);
      shoot = 0;
      nexttype = int(random(fruit_types.length));
    }
  }

  orbitControl();
  // cam.lookAt(0, 0, 0);
  // cam.setPosition(0, 1000, 1000);
  // setCamera(cam);
  // rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);
  stroke(0);
  noFill();
  push();
  scale(cell.x, cell.y, cell.z);
  box(1);
  pop();
  noStroke();
  // shininess(0)
  fill(0.4, 0, 0);
  ambientLight(100, 100, 100);
  ambientMaterial(255, 0, 0);
  pointLight(255, 255, 255, 1000, -1000, 1000);
  specularMaterial(0.3);
  let N = fruits.length;
  for (let i = 0; i < N; i++) {
    push();
    translate(fruits[i].position.x, fruits[i].position.y, fruits[i].position.z);
    rgb = fruit_types[fruits[i].type].rgb;
    ambientMaterial(rgb[0], rgb[1], rgb[2]);
    sphere(fruit_types[fruits[i].type].radius);
    pop();
  }

  // aim
  stroke(0);
  line(-cell.x / 2, aimy, +cell.z / 2, +cell.x / 2, aimy, +cell.z / 2);
  line(aimx, -cell.x / 2, +cell.z / 2, aimx, +cell.x / 2, +cell.z / 2);
  line(-cell.x / 2, aimy, -cell.z / 2, +cell.x / 2, aimy, -cell.z / 2);
  line(aimx, -cell.x / 2, -cell.z / 2, aimx, +cell.x / 2, -cell.z / 2);
  line(aimx, aimy, -cell.z / 2, aimx, aimy, +cell.z / 2);
  noStroke();
  push();
  translate(aimx, aimy, cell.z / 2);
  console.log(nexttype);
  rgb = fruit_types[nexttype].rgb;
  ambientMaterial(rgb[0], rgb[1], rgb[2]);
  // fill(rgb[0], rgb[1], rgb[2]);
  sphere(fruit_types[nexttype].radius);
  pop();
}
