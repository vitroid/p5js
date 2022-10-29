// 単位をきちんとする。
const Navogadro = 6.022e23
const Kboltzmann = 1.38e-23
const Rgas = Navogadro*Kboltzmann // J / mol / K

const sig = 0.363*1000 // pm
const eps = 231 * Rgas // J / mol
const mass = 44e-3 // atomic mass in kg / mol

const dt = 0.01 // ps
const Temperature = 270 // K, 温度制御しない時は0に設定
const Density = 1.56 * 0.1 // g/cm3
const numdens = Density * 1e-3/mass * Navogadro / 1e30 // 数密度、個/pm3

const sig2 = sig*sig
const sig6 = sig2*sig2*sig2
const sig12 = sig6*sig6

const NCL=4
const N=4*NCL**3
const volume = N/numdens  // pm3
const L = volume**(1/3)
const cell=[L,L,L]
var x = []
var y = []
var z = []
var vx = Array(N)
var vy = Array(N)
var vz = Array(N)

function fcc(NCL){
    // 分子の初期配置と初期速度。
    // 配置は重なら速度はランダム。
    for(let ix=0; ix<NCL; ix++){
        for(let iy=0; iy<NCL; iy++){
            for(let iz=0; iz<NCL; iz++){
                x.push(ix)
                y.push(iy)
                z.push(iz)
                x.push(ix+0.5)
                y.push(iy+0.5)
                z.push(iz)
                x.push(ix+0.5)
                y.push(iy)
                z.push(iz+0.5)
                x.push(ix)
                y.push(iy+0.5)
                z.push(iz+0.5)
            }
        }
    }
    for(let i=0; i<N; i++){
        x[i] /= NCL
        y[i] /= NCL
        z[i] /= NCL
    }
}

function initialize(){
    fcc(NCL)
    for(let i=0; i<N; i++){
        x[i] *= cell[0]
        y[i] *= cell[1]
        z[i] *= cell[2]
        vx[i] = 0
        vy[i] = random()*100 - 50
        vz[i] = random()*100 - 50
    }
}


function setup(){
    createCanvas(600,600,WEBGL)
    frameRate(30)
    initialize()
    normalMaterial()
    cam = createCamera()
    perspective(PI / 5.0, width / height, 0.1, 50000)
}


function force_LJ(x, y, z, x2, y2, z2){
    // 座標から、力を算出する。
    // 力の単位は、J / mol / pm
    let dx = x2 - x
    let dy = y2 - y
    let dz = z2 - z
    // 周期境界条件の処理
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
    // 座標から、エネルギーを算出する。
    // 単位は、J / mol
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

var visual = true

function draw(){
    for(let loop=0; loop<10; loop++){
        for(let i=0; i<N; i++){
            x[i] += vx[i] * dt/2
            y[i] += vy[i] * dt/2
            z[i] += vz[i] * dt/2
        }
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
            vx[i] += fx[i] / mass * dt
            vy[i] += fy[i] / mass * dt
            vz[i] += fz[i] / mass * dt
            x[i] += vx[i] * dt/2
            y[i] += vy[i] * dt/2
            z[i] += vz[i] * dt/2
        }
    }
    // エネルギー計算
    if ( frameCount % 10 == 0){
        var ep = 0
        for(let i=0; i<N; i++){
            for(let j=0; j<i; j++){
                ep += energy_LJ(x[i],y[i],z[i],x[j],y[j],z[j])
            }
        }
        ep /= N // J / mol
        var ek = 0
        for(let i=0; i<N; i++){
            ek += mass*(vx[i]**2 + vy[i]**2 + vz[i]**2)/2
        }
        ek /= N
        epp.push(ep)
        ekk.push(ek)
        console.log(ek / Rgas) // 瞬間温度
        if (epp.length > width / 10){
            epp.shift(0)
            ekk.shift(0)
        }
        // 温度制御
        if ( Temperature != 0 ){
            var ratio = ( ek > Temperature * Rgas )? 0.99 : 1.01
            for(let i=0; i<N; i++){
                vx[i] *= ratio
                vy[i] *= ratio
            }
        }
    }
    // 表示
    background(200)
    for(let i=0;i<epp.length;i++){
        stroke(0,0,255,100)
        strokeWeight(5)
        const x = (i-width/20)*100
        line(x, 0, x, -epp[i]/3)
        stroke(255,0,0,100)
        line(x, 0, x, -ekk[i]/3)
    }
    cam.lookAt(0,0,0)
    cam.setPosition(0,0,10000)
    setCamera(cam)
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    stroke(0)
    noFill()
    if (visual ){
        box(cell[0])
        noStroke()
        // shininess(0)
        fill(100,0,0)
        ambientLight(100,100,100)
        ambientMaterial(255,0,0)
        pointLight(255,255,255,10000,-10000,10000)
        specularMaterial(100)
        for(let i=0; i<N; i++){
            push()
            x[i] -= floor(x[i]/cell[0]+0.5)*cell[0]
            y[i] -= floor(y[i]/cell[1]+0.5)*cell[1]
            z[i] -= floor(z[i]/cell[2]+0.5)*cell[2]
            translate(x[i],y[i],z[i])
            sphere(sig/2)
            pop()
        }
    }
}

function mousePressed(){
    visual = ! visual
}
