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

var eps = []
var eks = []

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
}
function draw(){
    // 力の計算
    deltax = x - mouseX
    deltay = y - mouseY
    deltax2 = x2 - x
    deltay2 = y2 - y
    forcex = -deltax * k + deltax2 * k2
    forcey = -deltay * k + deltay2 * k2
    forcex2 = -deltax2 * k2
    forcey2 = -deltay2 * k2
    // 移動
    vx = vx + forcex / mass * dt
    vy = vy + forcey / mass * dt
    vx2 = vx2 + forcex2 / mass2 * dt
    vy2 = vy2 + forcey2 / mass2 * dt
    x = x + vx * dt
    y = y + vy * dt
    x2 = x2 + vx2 * dt
    y2 = y2 + vy2 * dt
    // エネルギー計算
    ep = k*(deltax*deltax + deltay*deltay)/2 + k2*(deltax2*deltax2 + deltay2*deltay2)/2
    ek = mass*(vx*vx + vy*vy)/2 + mass2*(vx2*vx2 + vy2*vy2)/2
    eps.push(ep)
    eks.push(ek)
    if (eps.length > width){
        eps.shift(0)
        eks.shift(0)
    }
    // 表示
    background(200)

    for(let i=0;i<eps.length;i++){
        stroke(0,0,255,100)
        line(i, height, i, height-eps[i]/100)
        stroke(255,0,0,100)
        line(i, height-eps[i]/100, i, height-(eps[i]+eks[i])/100)
    }

    stroke(0)
    line(x,y,mouseX,mouseY)
    line(x,y,x2, y2)
    fill(255)
    ellipse(x,y,50,50)
    ellipse(x2,y2,20,20)
}
