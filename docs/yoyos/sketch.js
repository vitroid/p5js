const mass = 3
const k = 0.4
const mass2 = 0.3
const k2 = 0.1
const dt = 0.1

let x = 0.0
let y = 0.0
let vx = 0.0
let vy = 0.0
let x2 = 0.0
let y2 = 0.0
let vx2 = 0.0
let vy2 = 0.0

var eps = []
var eks = []

function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
}
function draw(){
    // 力の計算
    let deltax = x - mouseX
    let deltay = y - mouseY
    let deltax2 = x2 - x
    let deltay2 = y2 - y
    let forcex = -deltax * k + deltax2 * k2
    let forcey = -deltay * k + deltay2 * k2
    let forcex2 = -deltax2 * k2
    let forcey2 = -deltay2 * k2
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
    let ep = k*(deltax*deltax + deltay*deltay)/2 + k2*(deltax2*deltax2 + deltay2*deltay2)/2
    let ek = mass*(vx*vx + vy*vy)/2 + mass2*(vx2*vx2 + vy2*vy2)/2
    eps.push(ep)
    eks.push(ek)
    if (eps.length > width){
        eps.shift(0)
        eks.shift(0)
    }
    // 表示
    background(200)

    noFill()
    for(let i=0;i<eps.length;i++){
        // 青 = ポテンシャルエネルギー
        stroke(0,0,255,100)
        line(i, height, i, height-eps[i]/100)
        // 赤 = 運動エネルギー
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
