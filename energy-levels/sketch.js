const N = 6;
const Etot = 8;
const Ns = Etot + 1;
var states = 0;
var hist = new Array(10);

function show_state() {
  strokeWeight(10);
  stroke(0, 0, 255, 50);
  for (let s = 0; s < 10; s++) {
    let y = height - s * 20;
    line(width - hist[s] / 16, y, width, y);
  }
  const state = new String(states).padStart(N, "0");
  fill(255, 0, 0);
  strokeWeight(1);
  for (let i = 0; i < N; i++) {
    stroke(0);
    let x = (i * width) / (N + 2);
    for (let s = 0; s < 10; s++) {
      let y = height - s * 20;
      line(x, y, x + width / (N + 4), y);
    }
    let s = state[i] * 1;
    hist[s] += 1;
    let y = height - s * 20;
    noStroke();
    ellipse(x + width / (N * 2 + 8), y, 20, 20);
  }
}

function setup() {
  let canvas = createCanvas(300, 300);
  canvas.parent("sketch-holder");
  frameRate(30);
  for (let i = 0; i < 10; i++) {
    hist[i] = 0;
  }
}

function next() {
  let total = 0;
  while (total != Etot) {
    states += 1;
    const state = new String(states).padStart(N, "0");
    total = 0;
    for (let i = 0; i < N; i++) {
      total += state[i] * 1;
    }
    console.log(states, total);
  }
}

function draw() {
  background(255);
  show_state();
  if (states == 800000) {
    noLoop();
  }
  next();
}
