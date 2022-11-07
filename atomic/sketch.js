x = 300.0
y = 50
vx = 0.0
vy = 0.0
mass = 50
x2 = 50.0
y2 = 300.0
vx2 = 0
vy2 = 0
sig = 50
sig2 = sig*sig
sig6 = sig2*sig2*sig2
sig12 = sig6*sig6
eps = 100000.0

dt = 0.01

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
    let d2 = dx*dx + dy*dy
    let d6 = d2*d2*d2
    let d12 = d6*d6
    let f = 4*eps*(-12*sig12/d12+6*sig6/d6)/d2
    return [f*dx, f*dy]
}

function draw(){
    // 移動
    x = x + vx * dt / 2
    y = y + vy * dt / 2
    x2 = x2 + vx2 * dt / 2
    y2 = y2 + vy2 * dt / 2
    // 力の計算
    var f = force_LJ(x, y, mouseX, mouseY)
    fx01 = f[0]
    fy01 = f[1]
    f = force_LJ(x2, y2, mouseX, mouseY)
    fx02 = f[0]
    fy02 = f[1]
    f = force_LJ(x, y, x2, y2)
    fx12 = f[0]
    fy12 = f[1]
    forcex = fx01 - fx12
    forcey = fy01 - fy12
    forcex2 = fx02 + fx12
    forcey2 = fy02 + fy12
    // 移動
    vx = vx + forcex / mass * dt
    vy = vy + forcey / mass * dt
    vx2 = vx2 + forcex2 / mass * dt
    vy2 = vy2 + forcey2 / mass * dt
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
