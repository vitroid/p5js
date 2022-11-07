function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    frameRate(30)
}
function draw(){
    // 表示
    background(200)
    stroke(0)
    fill(255)
    ellipse(mouseX,mouseY,20,20)
}
