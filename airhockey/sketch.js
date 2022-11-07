let x = 0.1
let y = 0.1
let vx = Math.random()
let vy = Math.random()
const dt = 10
const radius = 10.0

let px
let py

function setup(){
    createCanvas(141,100)
    frameRate(30)
}

const PADDLE = 0
const NOCOLL = -1
const LEFT = -2
const RIGHT = -3
const TOP = -4
const BOTTOM = -5
const labels = ["PADDLE", "", "LEFT", "RIGHT", "TOP", "BOTTOM"]
// 時間をdtだけ進める。
// 壁とパドルとの衝突の可能性を考える。
function progress(dt, last)
{
    // dt < 0 なら何もしない。
    if ( dt <= 0 ){
        return last
    }
    var collide = NOCOLL
    var t_coll = dt
    // 左の壁
    // x + vx*dt == 0 の時に衝突。
    // dt = -x/vx
    if ( last != LEFT ){
        let t_left = -x / vx
        if ( 0 <= t_left ){
            t_coll = t_left
            collide = LEFT
        }
    }
    // 右の壁
    // x + vx*dt == widthの時に衝突
    if ( last != RIGHT ){
        let t_right = (width-x) / vx
        if ( (0 <= t_right ) && ( t_right < t_coll ) ){
            t_coll = t_right
            collide = RIGHT
        }
    }
    // 上の壁
    if ( last != TOP ){
        let t_top = -y / vy
        if ( (0 <= t_top ) && (t_top < t_coll ) ){
            t_coll = t_top
            collide = TOP
        }
    }
    // 下の壁
    if ( last != BOTTOM ){
        let t_bottom = (height-y) / vy
        if ( (0 <= t_bottom ) && (t_bottom < t_coll ) ){
            t_coll = t_bottom
            collide = BOTTOM
        }
    }
    // パドル
    if ( last != PADDLE ){
        // パドルとの衝突はちょっと面倒。パドルの速度は0とする。
        // |x + vx*dt - px, y + vy*dt - py| == 2 r の時に衝突する。
        //  A dt**2 + B dt + C == 0 の時に衝突。
        let dx = x - px
        let dy = y - py
        let A = vx**2 + vy**2
        let B = 2*(vx*dx + vy*dy)
        let C = dx**2 + dy**2 - 4*radius**2
        let D = B**2 - 4*A*C
        if ( D > 0 ){
            let t_paddle = (-B-Math.sqrt(D))/(2*A)
            if ( (0 <= t_paddle ) && (t_paddle < t_coll ) ){
                t_coll = t_paddle
                collide = PADDLE
            }
        }
    }
    // t_collには最初の衝突までの時間、collideには衝突相手の番号が入っている。
    // 衝突までの時間よりもdtのほうが小さい場合は、dtだけ進める。
    if (t_coll > dt){
        x += vx*dt
        y += vy*dt
        return last
    }
    // t_collだけ進める。
    x += vx*t_coll
    y += vy*t_coll
    dt -= t_coll
    // 衝突した場合は、相手によって速度の向きを変える。
    if ( collide != NOCOLL ){
        if ( ( collide == BOTTOM ) || ( collide == TOP ) ){
            vy = -vy
        }
        else if ( ( collide == LEFT ) || ( collide == RIGHT ) ){
            vx = -vx
        }
        else {
            // paddleとの衝突。
            // t_collだけ進んだので、球とパドルは距離2rの位置にある。
            // 2者をつなぐベクトルの方向の速度成分を反転させる。
            let dx = (px - x) / (2*radius)
            let dy = (py - y) / (2*radius)
            // 速度の法線成分
            let norm = vx*dx + vy*dy
            vx -= 2*norm*dx
            vy -= 2*norm*dy
        }
        return progress(dt, collide)
    }
    return last
}

let last = NOCOLL

function draw(){
    px = mouseX
    py = mouseY
    last = progress(dt, last)
    // 表示
    background(200)
    stroke(0)
    fill(255)
    ellipse(x,y,radius*2,radius*2)
    ellipse(px,py,radius*2,radius*2)

    textSize(10)
    fill(0)
    text(labels[-last], 0, 10)
}
