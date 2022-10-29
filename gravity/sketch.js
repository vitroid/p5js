x = 100.0
y = 100.0
vx = 0.0
vy = 0.0
mass = 0.3
mass0 = 10
dt = 0.1
G = 10000

function setup(){
    createCanvas(600,600)
    frameRate(30)
}
function draw(){
    // 力の計算
    deltax = x - mouseX
    deltay = y - mouseY
    rr = deltax*deltax + deltay*deltay
    forcex = -G * mass * mass0 * deltax / rr**1.5
    forcey = -G * mass * mass0 * deltay / rr**1.5
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
    ellipse(mouseX,mouseY,50,50)
}
