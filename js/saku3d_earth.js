var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.light = new DirectionLight();
  this.light.lightDirection = [0,-1,1];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);

  this.noizeUtil = new NoiseUtil(new SimplexNoise(), CLOCK);
  var canvas = this.noizeUtil.update();
  this.mesh = new Earth(this.gl,this.scene3D
    , {modelData:  window.sphere(140, 140,8.0), specularIndex: 1, textureCanvas:canvas});

  this.water = new WaterBall(this.gl,this.scene3D
    , {modelData:  window.sphere(100, 100, 20, [0,0,1,0.5]), specularIndex: 1});


  this.mesh.z = -70;
  this.water.z = -70;
  this.water.x = -2;
  // this.mesh.y = 10;
  this.scene3D.addChild(this.mesh);
  this.scene3D.addChild(this.water);


  this.enterFrameHandler();
}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationY = 80;
  this.mesh.rotationX += .2;
  // this.mesh.rotationZ += .2;
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
