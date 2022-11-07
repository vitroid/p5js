x = 100.0
y = 100.0
vx = 10.0
vy = 0.0
mass = 0.3
mass0 = 10
dt = 0.1
G = 10000

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
}
function draw(){
    deltax = x - mouseX
    deltay = y - mouseY
    rr = deltax*deltax + deltay*deltay
    forcex = +G * mass * mass0 * deltax / rr**1.5
    forcey = +G * mass * mass0 * deltay / rr**1.5
    // 移動
    vx = vx + forcex / mass * dt
    vy = vy + forcey / mass * dt
    newx = x + vx * dt
    if ( (newx < 0) || (newx > width) ){
        vx = -vx
        newx = x + vx * dt
    }
    newy = y + vy * dt
    if ( (newy < 0) || (newy > height) ){
        vy = -vy
        newy = y + vy * dt
    }
    x = newx
    y = newy
    // 表示
    background(200)
    stroke(0)
    line(x,y,mouseX,mouseY)
    fill(255)
    ellipse(x,y,20,20)
    ellipse(mouseX,mouseY,50,50)
}
