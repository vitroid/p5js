# Hard spheres

最後に、2次元の剛体円盤の運動を、3次元の剛体球の運動に書きかえます。

* 運動を計算する部分に関しては、$(x,y)$の2次元で書かれている部分を全部$(x,y,z)$に書きかえるだけです。
* 3次元グラフィックスに対応させるために、表示部分`draw()`はかなり大幅に変更が必要です。
* 壁に当たった物体が壁に加える撃力を積算し、それを面積で割ることで、圧力が計算できます。

こんな単純なモデルでも、気体の分子運動のモデルとして有用です。
