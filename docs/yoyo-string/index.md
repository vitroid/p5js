# String Yo-yo

ゴムの代わりに、ひもでつながっている場合を考えてみます。(分子シミュレーションからだいぶ脱線してきました。)

## ひもの力

ゴムとひもの違いは次の通りです。

* ひもには標準の長さがあります。両端がそれよりも短い時には、力がまったくかかりません。($k=0$)
* 一方、標準の長さより延ばそうとすると、強い反発力が生じます。

これを、数式で表してみます。まず、通常のバネの力の式はこんな感じ。

(1)$$F=-k d$$

$d$はバネの両端の距離です。

これに対し、ひもの式はこんな風になります。

(2)$$F=-k (d - d_0)$$

$d_0$はひもの長さで、バネ定数$k$は$d$が$d_0$よりも小さい場合には0とします。

この式をベクトルに拡張する場合には、すこし複雑になります。

(2')$$\mathbf F=-k (|\mathbf d| - d_0) \cdot {\mathbf d\over |\mathbf d|}$$

右辺は、力の大きさ$-k (|\mathbf d| - d_0)$と向き$\mathbf d/ |\mathbf d|$の掛けあわせになっています。

## 改造してみよう

ついでに、重力も追加します。

重力は下($y$軸方向)に一定の加速を与える力です。重力加速度を$g$とすると、

(3)$$F_g=mg$$
と書けます。

プログラムの冒頭で、重力加速度定数を設定します。
```
const g=200.0
```

そして、外力を計算する時に、$y$方向にのみ力を追加します。動摩擦力の計算のあとがいいようです。
```
    forcey += mass*g
```