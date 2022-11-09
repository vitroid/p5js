const mass = 50
const sig = 50
const eps = 100000.0
const dt = 0.01

let x = 300.0
let y = 50
let vx = 0.0
let vy = 0.0
let x2 = 50.0
let y2 = 300.0
let vx2 = 0
let vy2 = 0

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
    mouseX = 300
    mouseY = 300
}


function force_LJ(x, y, x2, y2){
    let dx = x2 - x
    let dy = y2 - y
    let d2 = dx**2 + dy**2
    let f = 4*eps*(-12*sig**12/d2**6+6*sig**6/d2**3)/d2
    return [f*dx, f*dy]
}


function draw(){
    // 移動
    x = x + vx * dt / 2
    y = y + vy * dt / 2
    x2 = x2 + vx2 * dt / 2
    y2 = y2 + vy2 * dt / 2
    // 力の計算
    let f = force_LJ(x, y, mouseX, mouseY)
    let fx01 = f[0]
    let fy01 = f[1]
    f = force_LJ(x2, y2, mouseX, mouseY)
    let fx02 = f[0]
    let fy02 = f[1]
    f = force_LJ(x2, y2, x, y)
    let fx12 = f[0]
    let fy12 = f[1]
    let fx1 = fx01 - fx12
    let fy1 = fy01 - fy12
    let fx2 = fx12 + fx02
    let fy2 = fy12 + fy02
    // 移動
    vx = vx + fx1 / mass * dt
    vy = vy + fy1 / mass * dt
    vx2 = vx2 + fx2 / mass * dt
    vy2 = vy2 + fy2 / mass * dt
    x = x + vx * dt / 2
    y = y + vy * dt / 2
    x2 = x2 + vx2 * dt / 2
    y2 = y2 + vy2 * dt / 2
    // 表示
    background(200)
    stroke(0)
    line(x,y,mouseX,mouseY)
    line(x2,y2,mouseX,mouseY)
    line(x,y,x2, y2)
    fill(255)
    ellipse(mouseX,mouseY,50,50)
    ellipse(x,y,50,50)
    ellipse(x2,y2,50,50)
}
