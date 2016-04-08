var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.camera.lookPoint = [0,0,0];
  this.light = new DirectionLight();
  this.light.lightDirection = [0,1,3];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);

  this.noizeUtil = new NoiseUtil(new SimplexNoise(), CLOCK);
  var canvas = this.noizeUtil.update();



  this.water = new WaterBall(this.gl,this.scene3D
    , {modelData:  window.sphere(100, 100, 12.5, [0,0,1,0.6]), specularIndex: 1, programIndex:0});

  this.mesh = new Earth(this.gl,this.scene3D
    , {modelData:  window.sphere(150, 150,15), specularIndex: 1, textureCanvas:canvas});

  var srcFiles1 = {
    obj: "models/jetengine.obj",
    mtl: "models/jetengine.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData) {
    this.jetEngine = new JetEngine(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.jetEngine.setScale(2);

    this.scene3D.addChild(this.jetEngine);
    this.scene3D.addChild(this.mesh);
    this.scene3D.addChild(this.water);
    this.enterFrameHandler();
  }).bind(this));

}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationY = 80;
  this.mesh.rotationX += .002;
  var canvas = this.noizeUtil.update();
  this.mesh.setTexture(canvas);

  var time = CLOCK.getElapsedTime() / 1000;
  this.jetEngine.x = Math.sin(time + 18) * 20;
  this.jetEngine.y = Math.cos(time + 18) * 20;
  this.jetEngine.z = Math.sin(time + 18) * 20;
  this.jetEngine.rotationX += 1;
  this.jetEngine.rotationY += 1;
  this.jetEngine.rotationZ += 1;

  this.camera.x = Math.sin(time/2 + 8) * 100;
  this.camera.z = Math.cos(time/2 + 8) * 100;
  this.camera.y = Math.cos(time/4 + 8) * 10;

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
  var texturePashArray = ["images/explosion2.png"];
  //テクスチャ画像をImage要素としての読み込み
  ImageLoader.load(texturePashArray, loadCompleteHandler);
};
