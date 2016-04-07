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
    , {modelData:  window.sphere(140, 140,18.0), specularIndex: 1, textureCanvas:canvas});

  this.water = new WaterBall(this.gl,this.scene3D
    , {modelData:  window.sphere(100, 100, 15, [0,0,1,0.3]), specularIndex: 1, programIndex:0});



  this.mesh.z = this.water.z = -43;
  this.mesh.y = this.water.y = 12;
  this.scene3D.addChild(this.mesh);
  this.scene3D.addChild(this.water);


  this.enterFrameHandler();
}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationY = 80;
  this.mesh.rotationX += .002;
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
