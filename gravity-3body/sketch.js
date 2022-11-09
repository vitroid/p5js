const mass1 = 50
const mass2 = 0.5
const mass0 = 50
const G = 10000
const dt = 0.02

let x = 300.0
let y = 00
let vx = 40.0
let vy = 0.0
let x2 = 300.0
let y2 = 50.0
let vx2 = vx-100
let vy2 = .0

var epp = []
var ekk = []

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
    let deltax01 = x - mouseX
    let deltay01 = y - mouseY
    let deltax12 = x2 - x
    let deltay12 = y2 - y
    let deltax02 = x2 - mouseX
    let deltay02 = y2 - mouseY
    let d01 = Math.sqrt(deltax01**2 + deltay01**2)
    let d12 = Math.sqrt(deltax12**2 + deltay12**2)
    let d02 = Math.sqrt(deltax02**2 + deltay02**2)
    let fx01 = -G * mass0 * mass1 * deltax01 / d01**3
    let fy01 = -G * mass0 * mass1 * deltay01 / d01**3
    let fx12 = -G * mass1 * mass2 * deltax12 / d12**3
    let fy12 = -G * mass1 * mass2 * deltay12 / d12**3
    let fx02 = -G * mass0 * mass2 * deltax02 / d02**3
    let fy02 = -G * mass0 * mass2 * deltay02 / d02**3
    let fx1 = fx01 - fx12
    let fy1 = fy01 - fy12
    let fx2 = fx12 + fx02
    let fy2 = fy12 + fy02
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
    let ep = -G*mass0*mass1/d01 - G*mass1*mass2/d12 - G*mass0*mass2/d02
    let ek = mass1*(vx*vx + vy*vy)/2 + mass2*(vx2*vx2 + vy2*vy2)/2
    epp.push(ep)
    ekk.push(ek)
    if (epp.length > width){
        epp.shift(0)
        ekk.shift(0)
    }
    // 表示
    background(200)
    // ポテンシャルエネルギーの表示
    stroke(0,0,255,100)
    for(let i=0;i<epp.length;i++){
        line(i, height/2, i, height/2-epp[i]/1000)
    }
    // 運動エネルギーの表示
    stroke(255,0,0,100)
    for(let i=0;i<epp.length;i++){
        line(i, height/2, i, height/2-ekk[i]/1000)
    }
    // 全エネルギーの表示
    noStroke()
    fill(0)
    for(let i=0;i<epp.length;i++){
        ellipse(i, height/2 - (epp[i]+ekk[i])/1000,2,2)
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
