const mass = 50
const sig = 50
const eps = 100000.0
const dt = 0.002

let x = 300.0
let y = 50
let vx = 0.0
let vy = 0.0
let x2 = 50.0
let y2 = 300.0
let vx2 = 0
let vy2 = 0

function setup(){
    let canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
    mouseX = 300
    mouseY = 300
}


function force_LJ(x, y, x2, y2){
    let dx = x2 - x
    let dy = y2 - y
    if ( dx >= width/2 ){
        dx -= width
    }else if ( dx < -width/2 ){
        dx += width
    }
    if ( dy >= height/2 ){
        dy -= height
    }else if ( dy < -height/2 ){
        dy += height
    }
    let d2 = dx**2 + dy**2
    let f = 4*eps*(-12*sig**12/d2**6+6*sig**6/d2**3)/d2
    return [f*dx, f*dy]
}


function energy_LJ(x, y, x2, y2){
    let dx = x2 - x
    let dy = y2 - y
    if ( dx >= width/2 ){
        dx -= width
    }else if ( dx < -width/2 ){
        dx += width
    }
    if ( dy >= height/2 ){
        dy -= height
    }else if ( dy < -height/2 ){
        dy += height
    }
    let d2 = dx**2 + dy**2
    return 4*eps*(sig**12/d2**6-sig**6/d2**3)
}


let epp = []
let ekk = []

function draw(){
    for(let loop=0;loop<100;loop++){
        // 移動
        x = x + vx * dt / 2
        y = y + vy * dt / 2
        x2 = x2 + vx2 * dt / 2
        y2 = y2 + vy2 * dt / 2
        // 力の計算
        let f = force_LJ(x, y, mouseX, mouseY)
        let fx01 = f[0]
        let fy01 = f[1]
        f = force_LJ(x2, y2, mouseX, mouseY)
        let fx02 = f[0]
        let fy02 = f[1]
        f = force_LJ(x2, y2, x, y)
        let fx12 = f[0]
        let fy12 = f[1]
        let fx1 = fx01 - fx12
        let fy1 = fy01 - fy12
        let fx2 = fx12 + fx02
        let fy2 = fy12 + fy02
        vx = vx + fx1 / mass * dt
        vy = vy + fy1 / mass * dt
        vx2 = vx2 + fx2 / mass * dt
        vy2 = vy2 + fy2 / mass * dt
        // 移動
        x = x + vx * dt / 2
        y = y + vy * dt / 2
        if ( x >= width ){
            x -= width
        }else if ( x < 0 ){
            x += width
        }
        if ( y >= height ){
            y -= height
        }else if ( y < 0 ){
            y += height
        }
        x2 = x2 + vx2 * dt / 2
        y2 = y2 + vy2 * dt / 2
        if ( x2 >= width ){
            x2 -= width
        }else if ( x2 < 0 ){
            x2 += width
        }
        if ( y2 >= height ){
            y2 -= height
        }else if ( y2 < 0 ){
            y2 += height
        }
    }
    // // エネルギー計算
    let ep = energy_LJ(x,y,mouseX,mouseY) + energy_LJ(x,y,x2,y2) + energy_LJ(x2,y2,mouseX, mouseY)
    let ek = mass*(vx*vx + vy*vy)/2 + mass*(vx2*vx2 + vy2*vy2)/2
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
        line(i, height/2, i, height/2-epp[i]/500)
    }
    // 運動エネルギーの表示
    stroke(255,0,0,100)
    for(let i=0;i<epp.length;i++){
        line(i, height/2, i, height/2-ekk[i]/500)
    }
    // 全エネルギーの表示
    noStroke()
    fill(0)
    for(let i=0;i<epp.length;i++){
        ellipse(i, height/2 - (epp[i]+ekk[i])/500,2,2)
    }
    stroke(0)
    push()
    scale(1/3)
    translate(width,height)
    line(0,-height, 0, height*2)
    line(width,-height, width, height*2)
    line(-width,0, width*2, 0)
    line(-width,height, width*2, height)
    fill(255)
    for (let cx=-1; cx<=1; cx++){
        for (let cy=-1; cy<=1; cy++){
            push()
            translate(cx*width, cy*height)
            let dx=mouseX-x
            let dy=mouseY-y
            if ( dx >= width/2 ){
                dx -= width
            }else if ( dx < -width/2 ){
                dx += width
            }
            if ( dy >= height/2 ){
                dy -= height
            }else if ( dy < -height/2 ){
                dy += height
            }
            line(x,y,x+dx,y+dy)
            dx=mouseX-x2
            dy=mouseY-y2
            if ( dx >= width/2 ){
                dx -= width
            }else if ( dx < -width/2 ){
                dx += width
            }
            if ( dy >= height/2 ){
                dy -= height
            }else if ( dy < -height/2 ){
                dy += height
            }
            line(x2,y2,x2+dx,y2+dy)
            dx=x2-x
            dy=y2-y
            if ( dx >= width/2 ){
                dx -= width
            }else if ( dx < -width/2 ){
                dx += width
            }
            if ( dy >= height/2 ){
                dy -= height
            }else if ( dy < -height/2 ){
                dy += height
            }
            line(x,y,x+dx,y+dy)
            ellipse(mouseX,mouseY,50,50)
            ellipse(x,y,50,50)
            ellipse(x2,y2,50,50)
            pop()
        }
    }
    pop()
}
