function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
    background(200)
    ellipse(0, 0, width*2, height*2)
}

let nsand = 0
let nin = 0

function spray(){
    const x = Math.random()
    const y = Math.random()
    ellipse(x*width, y*height, 2, 2)
    nsand ++
    if ( x**2 + y**2 < 1 ){
        nin ++
    }
}


function draw(){
    let nloop = 1.01 ** frameCount
    noStroke(0)
    fill(100)
    for(let i=0; i<nloop; i++){
        spray()
    }

    stroke(0)
    fill(255)
    rect(18,20,80,48)
    fill(0)
    noStroke()
    textSize(20)
    text(nsand, 20, 40)
    text((4*nin/nsand).toPrecision(4), 20, 64)
    if ( nloop > 1000){
        // 停止
        noLoop()
    }
}
