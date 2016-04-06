var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.light = new DirectionLight();
  this.light.lightDirection = [0,-1,0];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);

  this.noizeUtil = new NoiseUtil(new SimplexNoise(), CLOCK);
  var canvas = this.noizeUtil.update();
  this.mesh = new Earth(this.gl,this.scene3D
    , {modelData:  window.sphere(140, 140,18.0), specularIndex: 1, textureCanvas:canvas});

  this.mesh.z = -70;
  // this.mesh.y = 10;
  this.scene3D.addChild(this.mesh);


  this.enterFrameHandler();
}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationY = 90;
  this.mesh.rotationX += .2;
  var canvas = this.noizeUtil.update();
  this.mesh.setTexture(canvas);

  this.scene3D.render();

  requestAnimationFrame(this.enterFrameHandler.bind(this))
}

inherits(World, AbstractWorld);


window.onload = function () {

  //テクスチャ読み込み後の処理
  var loadCompleteHandler = function () {
    //ドキュメントクラス的なもの canvasのIDを渡す
    var initialize = function (returnValue) {
      for (var val in ImageLoader.images) {
        console.log("loaded : ", ImageLoader.images[val]);
      }
    };
    new World();
  };


  //テクスチャ画像リスト
  var texturePashArray = ["images/beans.jpg"];
  //テクスチャ画像をImage要素としての読み込み
  ImageLoader.load(texturePashArray, loadCompleteHandler);
};
