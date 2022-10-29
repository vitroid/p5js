x = 0.0
y = 0.0
vx = 0.0
vy = 0.0
mass = 0.3
dt = 0.1
k = 0.1

function setup(){
    createCanvas(600,600)
    frameRate(30)
}
function draw(){
    // 力の計算
    deltax = x - mouseX
    deltay = y - mouseY
    forcex = -deltax * k
    forcey = -deltay * k
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