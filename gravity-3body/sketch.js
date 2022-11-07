x = 300.0
y = 00
vx = 40.0
vy = 0.0
mass1 = 50
x2 = 300.0
y2 = 50.0
vx2 = vx-100
vy2 = .0
mass2 = 0.5
mass0 = 50
G = 10000

dt = 0.02

var eps = []
var eks = []

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
    mouseX = 300
    mouseY = 300
}


function draw(){
    // 移動
    x = x + vx * dt / 2
    y = y + vy * dt / 2
    x2 = x2 + vx2 * dt / 2
    y2 = y2 + vy2 * dt / 2
    // 力の計算
    deltax01 = x - mouseX
    deltay01 = y - mouseY
    deltax12 = x2 - x
    deltay12 = y2 - y
    deltax02 = x2 - mouseX
    deltay02 = y2 - mouseY
    rr01 = deltax01*deltax01 + deltay01*deltay01
    rr12 = deltax12*deltax12 + deltay12*deltay12
    rr02 = deltax02*deltax02 + deltay02*deltay02
    fx01 = -G * mass0 * mass1 * deltax01 / rr01**1.5
    fy01 = -G * mass0 * mass1 * deltay01 / rr01**1.5
    fx12 = -G * mass1 * mass2 * deltax12 / rr12**1.5
    fy12 = -G * mass1 * mass2 * deltay12 / rr12**1.5
    fx02 = -G * mass0 * mass2 * deltax02 / rr02**1.5
    fy02 = -G * mass0 * mass2 * deltay02 / rr02**1.5
    fx1 = fx01 - fx12
    fy1 = fy01 - fy12
    fx2 = fx12 + fx02
    fy2 = fy12 + fy02
    // 移動
    vx = vx + fx1 / mass1 * dt
    vy = vy + fy1 / mass1 * dt
    vx2 = vx2 + fx2 / mass2 * dt
    vy2 = vy2 + fy2 / mass2 * dt
    x = x + vx * dt / 2
    y = y + vy * dt / 2
    x2 = x2 + vx2 * dt / 2
    y2 = y2 + vy2 * dt / 2
    // エネルギー計算
    ep = -G*mass0*mass1/sqrt(rr01) - G*mass1*mass2/sqrt(rr12) - G*mass0*mass2/sqrt(rr02)
    ek = mass1*(vx*vx + vy*vy)/2 + mass2*(vx2*vx2 + vy2*vy2)/2
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
        line(i, height/2, i, height/2-eps[i]/1000)
        stroke(255,0,0,100)
        line(i, height/2, i, height/2-eks[i]/1000)
    }
    stroke(0)
    line(x,y,mouseX,mouseY)
    line(x2,y2,mouseX,mouseY)
    line(x,y,x2, y2)
    fill(255)
    ellipse(mouseX,mouseY,50,50)
    ellipse(x,y,50,50)
    ellipse(x2,y2,20,20)
}
