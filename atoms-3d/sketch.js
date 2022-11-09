const sig = 50
const eps = 100.0
const dt = 0.001
const N = 20
const T = 150
const cell = [200,200,300]

let x = Array(N)
let y = Array(N)
let z = Array(N)
let vx = Array(N)
let vy = Array(N)
let vz = Array(N)
let mass = Array(N)

var cam

function arrange_atoms(){
    // 面心立方格子につめて配列する。
    let spacing = sig*1.02*Math.sqrt(2) / 2
    let NX = Math.floor(cell[0] / spacing)
    let NY = Math.floor(cell[1] / spacing)
    let NZ = Math.floor(cell[2] / spacing)
    let i=0
    for(let X=0; X<NX; X++){
        for(let Y=0; Y<NY; Y++){
            for(let Z=0; Z<NZ; Z++){
                if ( (X+Y+Z)%2 == 0 ){
                    x[i] = X*spacing
                    y[i] = Y*spacing
                    z[i] = Z*spacing
                    vx[i] = random()*100 - 50
                    vy[i] = random()*100 - 50
                    vz[i] = random()*100 - 50
                    mass[i] = 1.0
                    i++
                    if (i==N){
                        return
                    }
                }
            }
        }
    }
}


function setup(){
    let canvas = createCanvas(600,600,WEBGL)
    canvas.parent('sketch-holder')
    frameRate(30)
    arrange_atoms()
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
    let f = 4*eps*(-12*sig**12/d2**6+6*sig**6/d2**3)/d2
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
    return 4*eps*(sig**12/d2**6-sig**6/d2**3)
}


let epp = []
let ekk = []

function draw(){
    for(let loop=0; loop<100; loop++){
        // 移動
        for(let i=0; i<N; i++){
            x[i] += vx[i] * dt / 2
            y[i] += vy[i] * dt / 2
            z[i] += vz[i] * dt / 2
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
            vx[i] += fx[i] / mass[i] * dt
            vy[i] += fy[i] / mass[i] * dt
            vz[i] += fz[i] / mass[i] * dt
            x[i] += vx[i] * dt / 2
            y[i] += vy[i] * dt / 2
            z[i] += vz[i] * dt / 2
            x[i] -= floor(x[i]/cell[0]+0.5)*cell[0]
            y[i] -= floor(y[i]/cell[1]+0.5)*cell[1]
            z[i] -= floor(z[i]/cell[2]+0.5)*cell[2]
        }
    }
    // // エネルギー計算
    let ep = 0
    for(let i=0; i<N; i++){
        for(let j=0; j<i; j++){
            ep += energy_LJ(x[i],y[i],z[i],x[j],y[j],z[j])
        }
    }
    let ek = 0
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
    if ( ek/N > T ){
        for(let i=0; i<N; i++){
            vx[i] *= 0.99
            vy[i] *= 0.99
        }
    }
    // 表示
    background(200)
    // ポテンシャルエネルギーの表示
    stroke(0,0,255,100)
    for(let i=0;i<epp.length;i++){
        line(i-width/2, 0, i-width/2, -epp[i]/100)
    }
    // 運動エネルギーの表示
    stroke(255,0,0,100)
    for(let i=0;i<epp.length;i++){
        line(i-width/2, 0, i-width/2, -ekk[i]/100)
    }
    // 全エネルギーの表示
    noStroke()
    fill(0)
    for(let i=0;i<epp.length;i++){
        ellipse(i-width/2, - (epp[i]+ekk[i])/100,2,2)
    }
    cam.lookAt(0,0,0)
    cam.setPosition(0,0,1000)
    setCamera(cam)
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    stroke(0)
    noFill()
    push()
    scale(cell[0], cell[1], cell[2])
    box(1)
    pop()
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
        sphere(25)
        pop()
    }
}
