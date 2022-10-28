x = 0.0
y = 0.0
vx = 0.0
vy = 0.0
mass = 3
k = 0.4
x2 = 0.0
y2 = 0.0
vx2 = 0.0
vy2 = 0.0
mass2 = 0.3
k2 = 0.1

dt = 0.1

function setup(){
    createCanvas(600,600)
    frameRate(30)
}
function draw(){
    deltax = mouseX - x
    deltay = mouseY - y
    deltax2 = x - x2
    deltay2 = y - y2
    forcex = deltax * k - deltax2 * k2
    forcey = deltay * k - deltay2 * k2
    forcex2 = deltax2 * k2
    forcey2 = deltay2 * k2

    vx = vx + forcex / mass * dt
    vy = vy + forcey / mass * dt
    vx2 = vx2 + forcex2 / mass2 * dt
    vy2 = vy2 + forcey2 / mass2 * dt
    x = x + vx * dt
    y = y + vy * dt
    x2 = x2 + vx2 * dt
    y2 = y2 + vy2 * dt
    background(255)
    stroke(0)
    line(x,y,mouseX,mouseY)
    line(x,y,x2, y2)
    fill(255)
    ellipse(x,y,50,50)
    ellipse(x2,y2,20,20)
}
