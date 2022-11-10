// 最初に一度だけ実行される部分
function setup(){
    var canvas = createCanvas(600,600)
    canvas.parent('sketch-holder')
    // 毎秒30枚描く
    frameRate(30)

    // 背景色は最初に塗り、あとはどんどん上書きする。
    background(200)
    // 四分円を描いておく
    ellipse(0, 0, width*2, height*2)
}

let nsand = 0
let nin = 0

// 砂を撒き、円の中に入った数を数える関数
function spray(){
    // 0〜1の乱数
    const x = Math.random()
    const y = Math.random()
    // 砂粒を描く
    ellipse(x*width, y*height, 2, 2)
    // 砂の個数
    nsand ++
    // もし原点から1以内の距離にあれば、それは円内
    if ( x**2 + y**2 < 1 ){
        // 円に入った砂の数
        nin ++
    }
}


// 毎秒30回呼びだされる関数
function draw(){
    // 一度に撒く砂の数を決める。
    // frameCountは最初のコマから数えて何コマ目か
    let nloop = 1.01 ** frameCount
    // 砂を撒く
    noStroke(0)
    fill(100)
    for(let i=0; i<nloop; i++){
        spray()
    }

    // 統計量を表示する。
    // 文字を書く枠を作る。
    stroke(0)
    fill(255)
    rect(18,20,80,48)
    // 中に数値を書く。
    fill(0)
    noStroke()
    textSize(20)
    text(nsand, 20, 40)
    text((4*nin/nsand).toPrecision(4), 20, 64)
    // もし一度に撒く砂の個数が1000を越えたら
    if ( nloop > 1000){
        // 停止
        noLoop()
    }
}
