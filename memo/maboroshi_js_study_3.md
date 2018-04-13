# まぼろしのJS勉強会 #3 「Your next hurdle」LT資料

https://maboroshi.connpass.com/event/82184/?utm_campaign=event_reminder&utm_source=notifications&utm_medium=email&utm_content=title_link

---

## webglでグラディスⅢ

---

twitterでこんな映像を見た

https://twitter.com/krispykrouton

※PICO-8/レトロ風ゲームの開発ツール


低解像度、低発色なのにヌルヌル動く3D

カッコいい（昭和脳）

---

真似してみよう

---

2年くらい前にwebglの勉強がてらプチ3Dエンジンを自作してグラディウス3のCube Rushをっぽいものを作ってた。

http://sakusan393.github.io/saku3d/test.html

このcanvasを低解像度にして、それをcssで拡大してimage-rendering:pixelatedしたらドット絵になるはず。

---

ひとまずは超シンプルなポリゴンで実験

https://sakusan393.github.io/book_webgl_practice/sample/sample001_pixelated.html

---

PCはいけた

---

・・・が、SP(iOS11 Androind8)はimage-renderingが効かぬ

---

※ただしcanvas.getContext('2d')ならSPでもimage-renderingは効く

http://393.bz/

こんな画像を拡大している。

http://393.bz/images/393_atlas_.png

---

どうも、canvas.getContext('webgl')のポリゴンがダメっぽい。
※ただしテクスチャに関しては、ぼかさない設定あり

```
// webglでのTextureの設定
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
```

http://393.bz/threejs/wheresflasher.html

---

仕方ないのでモザイク的なポストプロセスを実装

参考：レトロゲームの画面解像度(ざっくり)
FC: 256*224
SFC: 256*224
PCE: 256*224
AC基盤: 320*224


モザイク処理のシェーダーはこちらを参考に。

https://ics.media/entry/5535

---

色数も制限したほうがレトロ感でるかも

参考：レトロゲームの同時発色数
FC: 25色
SFC: 256色
PCE: 512色
MD: 64色

※グラディウスⅢのAC基盤の最大発色数は情報みあたらず
(昔のAC基盤は、1スプライトあたり16色との情報あり)

---

8bitカラー(256色)の近似値をとるような処理

(内訳はR:2bit G:3bit B:3bit)

```
float ratioR = 4.0;
float ratioG = 8.0;
float ratioB = 8.0;
destColor.r = float(int(destColor.r * ratioR)) / ratioR;
destColor.g = float(int(destColor.g * ratioG)) / ratioG;
destColor.b = float(int(destColor.b * ratioB)) / ratioB;
```

http://sakusan393.github.io/saku3d/test_moai.html

---

そんな感じでできたのがこちら

http://sakusan393.github.io/saku3d/gradius3_stage5.html

---

まとめと今後の展望

* webglなcanvasにimage-rendering:pixelatedはスマホに効かぬ
  * canvas2dなら無問題
  * webglでもTextureに関しては別の設定でイケル
* ポストプロセスなどを追加し、低解像度/低発色を実現したところで描画負荷をよけいに高めることになる。
  * レトロゲームにおける容量削減の意義とは真逆で本末転倒。
* グラディウスⅢは来年で稼働から30周年
  * 来年中に全10ステージ分を作りたい
* 沙羅曼蛇のプロミネンスもいつか、きっと・・・
  * ボリュームレンダリングの炎のサンプルがいい感じだけど、理解できずに2年前に挫折している・・・
    * https://www.youtube.com/watch?v=jKRHmQmduDI
