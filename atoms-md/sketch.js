var visual = true
var mdlj = new MDLJ(363, 231, 0.15, 200)

function setup(){
    var canvas = createCanvas(600,600,WEBGL)
    canvas.parent('sketch-holder');
    normalMaterial()
    cam = createCamera()
    perspective(PI / 5.0, width / height, 0.1, 50000)
    // no drawing loop
    noLoop()
}

// it is called manually via redraw()
function draw(){
    // 表示
    background(200)
    // console.log(mdlj.epp)
    for(let i=0; i<mdlj.epp.length;i++){
        stroke(0,0,255,100)
        strokeWeight(5)
        const x = (i-width/20)*100
        line(x, 0, x, -mdlj.epp[i]/5)
        stroke(255,0,0,100)
        line(x, 0, x, -mdlj.ekk[i]/5)
    }
    cam.lookAt(0,0,0)
    cam.setPosition(0,0,10000)
    setCamera(cam)
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    stroke(0)
    noFill()
    if (visual ){
        box(mdlj.cell[0])
        noStroke()
        // shininess(0)
        fill(100,0,0)
        ambientLight(100,100,100)
        ambientMaterial(255,0,0)
        pointLight(255,255,255,10000,-10000,10000)
        specularMaterial(100)
        for(let i=0; i<mdlj.N; i++){
            push()
            let xx = mdlj.x[i] - floor(mdlj.x[i]/mdlj.cell[0]+0.5)*mdlj.cell[0]
            let yy = mdlj.y[i] - floor(mdlj.y[i]/mdlj.cell[1]+0.5)*mdlj.cell[1]
            let zz = mdlj.z[i] - floor(mdlj.z[i]/mdlj.cell[2]+0.5)*mdlj.cell[2]
            translate(xx, yy, zz)
            // console.log(xx,yy,zz, mdlj.sig, mdlj.cell)
            sphere(mdlj.sig/2)
            pop()
        }
    }
}

// function mousePressed(){
//     visual = ! visual
// }
