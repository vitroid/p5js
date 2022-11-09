const dt = 0.1
const mass = 0.3
const k = 0.1
const fm=0.1
const fc=100 * mass

let x = 0.0
let y = 0.0
let vx = 0.0
let vy = 0.0

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
}

function draw(){
    // 力の計算
    deltax = x - mouseX
    deltay = y - mouseY
    forcex = -deltax * k
    forcey = -deltay * k
    // 静止摩擦力
    // 外力の二乗
    ff = forcex**2 + forcey**2
    // 外力がfcに満たなければ
    if ( ff < fc*fc ){
        // 力はすべてキャンセルする。
        forcex = 0
        forcey = 0
    }
    // 動摩擦力
    forcex -= vx*fm
    forcey -= vy*fm
    // 移動
    vx = vx + forcex / mass * dt
    vy = vy + forcey / mass * dt
    x = x + vx * dt
    y = y + vy * dt
    // 表示
    background(200)
    stroke(0)
    line(x,y,mouseX,mouseY)
    fill(255)
    ellipse(x,y,20,20)
}
