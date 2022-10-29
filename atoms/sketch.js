sig = 50
sig2 = sig*sig
sig6 = sig2*sig2*sig2
sig12 = sig6*sig6
eps = 100.0

dt = 0.001

const N=20
var x = Array(N)
var y = Array(N)
var vx = Array(N)
var vy = Array(N)
var mass = Array(N)


function initialize(){
    var X = 1
    var row = 0
    var Y = row*52 + 25
    for(let i=0; i<N; i++){
        x[i] = X
        y[i] = Y
        X += 52
        if ( X > width - 55 ){
            row += 1
            X = (row % 2)*27 + 1
            Y = row*52 + 25
        }
        vx[i] = 0
        vy[i] = random()*100 - 50
        mass[i] = 1.0
    }
}

function setup(){
    createCanvas(400,400)
    frameRate(30)
    initialize()
}


function force_LJ(x, y, x2, y2){
    let dx = x2 - x
    let dy = y2 - y
    dx -= floor(dx/width+0.5)*width
    dy -= floor(dy/height+0.5)*height
    let d2 = dx*dx + dy*dy
    let d6 = d2*d2*d2
    let d12 = d6*d6
    let f = 4*eps*(-12*sig12/d12+6*sig6/d6)/d2
    return [f*dx, f*dy]
}


function energy_LJ(x, y, x2, y2){
    let dx = x2 - x
    let dy = y2 - y
    dx -= floor(dx/width+0.5)*width
    dy -= floor(dy/height+0.5)*height
    let d2 = dx*dx + dy*dy
    let d6 = d2*d2*d2
    let d12 = d6*d6
    return 4*eps*(sig12/d12-sig6/d6)
}


var epp = []
var ekk = []

function draw(){
    for(let loop=0; loop<100; loop++){
        // 移動
        for(let i=0; i<N; i++){
            x[i] += vx[i] * dt / 2
            y[i] += vy[i] * dt / 2
            x[i] -= floor(x[i]/width)*width
            y[i] -= floor(y[i]/height)*height
        }
        // 力の計算
        let fx = Array(N)
        let fy = Array(N)
        for(let i=0; i<N; i++){
            fx[i] = fy[i] = 0
        }
        for(let i=0; i<N; i++){
            for(let j=0; j<i; j++){
                f = force_LJ(x[i],y[i],x[j],y[j])
                fx[i] += f[0]
                fy[i] += f[1]
                fx[j] -= f[0]
                fy[j] -= f[1]
            }
        }
        // 移動
        for(let i=0; i<N; i++){
            vx[i] += fx[i] / mass[i] * dt
            vy[i] += fy[i] / mass[i] * dt
            x[i] += vx[i] * dt / 2
            y[i] += vy[i] * dt / 2
            x[i] -= floor(x[i]/width)*width
            y[i] -= floor(y[i]/height)*height
        }
    }
    // // エネルギー計算
    var ep = 0
    for(let i=0; i<N; i++){
        for(let j=0; j<i; j++){
            ep += energy_LJ(x[i],y[i],x[j],y[j])
        }
    }
    var ek = 0
    for(let i=0; i<N; i++){
        ek += mass[i]*(vx[i]**2 + vy[i]**2)/2
    }
    epp.push(ep)
    ekk.push(ek)
    if (epp.length > width){
        epp.shift(0)
        ekk.shift(0)
    }
    // 温度制御
    if ( ek > 50 * N ){
        for(let i=0; i<N; i++){
            vx[i] *= 0.99
            vy[i] *= 0.99
        }
    }
    // 表示
    background(200)
    for(let i=0;i<epp.length;i++){
        stroke(0,0,255,100)
        line(i, height/2, i, height/2-epp[i]/100)
        stroke(255,0,0,100)
        line(i, height/2, i, height/2-ekk[i]/100)
    }
    stroke(0)
    fill(255)
    for(let i=0; i<N; i++){
        ellipse(x[i],y[i],50,50)
    }
}
