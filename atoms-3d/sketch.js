sig = 50
sig2 = sig*sig
sig6 = sig2*sig2*sig2
sig12 = sig6*sig6
eps = 100.0

dt = 0.001

const N=20
var x = Array(N)
var y = Array(N)
var z = Array(N)
var vx = Array(N)
var vy = Array(N)
var vz = Array(N)
var mass = Array(N)
var cell = [300,300,300]

function initialize(){
    var X = 1
    var row = 0
    var Y = row*52 + 25
    var Z = 25
    for(let i=0; i<N; i++){
        x[i] = X
        y[i] = Y
        z[i] = Z
        X += 52
        if ( X > cell[0] - 55 ){
            row += 1
            X = (row % 2)*27 + 1
            Y = row*52 + 25
            if ( Y > cell[1] - 55){
                Y = 1
                Z += 55
            }
        }
        vx[i] = 0
        vy[i] = random()*100 - 50
        vz[i] = random()*100 - 50
        mass[i] = 1.0
    }
}

function setup(){
    createCanvas(600,600,WEBGL)
    frameRate(30)
    initialize()
    normalMaterial()
    cam = createCamera()
    perspective(PI / 5.0, width / height, 0.1, 5000)
}


function force_LJ(x, y, z, x2, y2, z2){
    let dx = x2 - x
    let dy = y2 - y
    let dz = z2 - z
    dx -= floor(dx/cell[0]+0.5)*cell[0]
    dy -= floor(dy/cell[1]+0.5)*cell[1]
    dz -= floor(dz/cell[2]+0.5)*cell[2]
    let d2 = dx*dx + dy*dy + dz*dz
    let d6 = d2*d2*d2
    let d12 = d6*d6
    let f = 4*eps*(-12*sig12/d12+6*sig6/d6)/d2
    return [f*dx, f*dy, f*dz]
}


function energy_LJ(x, y, z, x2, y2, z2){
    let dx = x2 - x
    let dy = y2 - y
    let dz = z2 - z
    dx -= floor(dx/cell[0]+0.5)*cell[0]
    dy -= floor(dy/cell[1]+0.5)*cell[1]
    dz -= floor(dz/cell[2]+0.5)*cell[2]
    let d2 = dx*dx + dy*dy + dz*dz
    let d6 = d2*d2*d2
    let d12 = d6*d6
    return 4*eps*(sig12/d12-sig6/d6)
}


var epp = []
var ekk = []

function draw(){
    for(let loop=0; loop<100; loop++){
        // 力の計算
        let fx = Array(N)
        let fy = Array(N)
        let fz = Array(N)
        for(let i=0; i<N; i++){
            fx[i] = fy[i] = fz[i] = 0
        }
        for(let i=0; i<N; i++){
            for(let j=0; j<i; j++){
                f = force_LJ(x[i],y[i],z[i],x[j],y[j],z[j])
                fx[i] += f[0]
                fy[i] += f[1]
                fz[i] += f[2]
                fx[j] -= f[0]
                fy[j] -= f[1]
                fz[j] -= f[2]
            }
        }
        // 移動
        for(let i=0; i<N; i++){
            vx[i] += fx[i] / mass[i] * dt / 2
            vy[i] += fy[i] / mass[i] * dt / 2
            vz[i] += fz[i] / mass[i] * dt / 2
            x[i] += vx[i] * dt
            y[i] += vy[i] * dt
            z[i] += vz[i] * dt
            x[i] -= floor(x[i]/cell[0]+0.5)*cell[0]
            y[i] -= floor(y[i]/cell[1]+0.5)*cell[1]
            z[i] -= floor(z[i]/cell[2]+0.5)*cell[2]
            vx[i] += fx[i] / mass[i] * dt / 2
            vy[i] += fy[i] / mass[i] * dt / 2
            vz[i] += fz[i] / mass[i] * dt / 2
        }
    }
    // // エネルギー計算
    var ep = 0
    for(let i=0; i<N; i++){
        for(let j=0; j<i; j++){
            ep += energy_LJ(x[i],y[i],z[i],x[j],y[j],z[j])
        }
    }
    var ek = 0
    for(let i=0; i<N; i++){
        ek += mass[i]*(vx[i]**2 + vy[i]**2 + vz[i]**2)/2
    }
    epp.push(ep)
    ekk.push(ek)
    if (epp.length > width){
        epp.shift(0)
        ekk.shift(0)
    }
    // 温度制御
    if ( ek > 250 * N ){
        for(let i=0; i<N; i++){
            vx[i] *= 0.99
            vy[i] *= 0.99
        }
    }
    // 表示
    background(200)
    for(let i=0;i<epp.length;i+=5){
        stroke(0,0,255,100)
        line(i-width/2, 0, i-width/2, -epp[i]/100)
        stroke(255,0,0,100)
        line(i-width/2, 0, i-width/2, -ekk[i]/100)
    }
    cam.lookAt(0,0,0)
    cam.setPosition(0,0,1000)
    setCamera(cam)
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    stroke(0)
    noFill()
    box(cell[0])
    noStroke()
    // shininess(0)
    fill(100,0,0)
    ambientLight(100,100,100)
    ambientMaterial(255,0,0)
    pointLight(255,255,255,1000,-1000,1000)
    specularMaterial(100)
    for(let i=0; i<N; i++){
        push()
        translate(x[i],y[i],z[i])
        console.log(x[i])
        sphere(25)
        pop()
    }
}
