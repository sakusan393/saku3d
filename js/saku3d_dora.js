var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.camera.lookPoint = [0,0,0];
  this.camera.fov = Math.PI / 180 * 45;
  this.light = new DirectionLight();
  this.light.lightDirection = [3,2,4];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  // this.canvasTextureUtil = new NoiseUtil(new SimplexNoise(), CLOCK);
  // var canvas = this.canvasTextureUtil.update();

  var srcFiles1 = {
    obj: "models/soyuz.obj",
    mtl: "models/soyuz.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData) {
    this.jetEngine = new Satellite(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.jetEngine.setScale(5);

    this.scene3D.addChild(this.jetEngine);

    var srcFiles2 = {
      obj: "models/spacesafeboat.obj",
      mtl: "models/spacesafeboat.mtl"
    };
    ObjLoader.load(srcFiles2, (function(modelData) {
      this.soyuz2 = new Satellite(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
      this.soyuz2.setScale(1);

      this.scene3D.addChild(this.soyuz2);
      this.mesh = new DoraStar(this.gl,this.scene3D
        , {modelData:  window.sphere(60, 60,15), specularIndex: 1});
      this.scene3D.addChild(this.mesh);
      this.water = new WaterBall(this.gl,this.scene3D
        , {modelData:  window.sphere(60, 60, 12.5, [0,0,1,1.0]), specularIndex: 1, programIndex:0});
      this.scene3D.addChild(this.water);
      this.loadCompleted();
    }).bind(this));


  }).bind(this));

}
World.prototype.loadCompleted = function () {

  this.enterFrameHandler();

}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationX = 0;
  this.mesh.rotationY += .1;

  var time = CLOCK.getElapsedTime() / 1000;
  this.jetEngine.x = Math.sin(time * 1) * 24;
  this.jetEngine.z = Math.cos(time * 1) * 24;
  this.soyuz2.x = Math.sin(time * 0.1) * 20;
  this.soyuz2.z = Math.cos(time * 0.1) * 20;
  // this.jetEngine.z = 20;
  this.jetEngine.rotationX += 1;
  this.jetEngine.rotationY += .5;
  this.jetEngine.rotationZ += .02

  this.soyuz2.rotationX += .4;
  this.soyuz2.rotationY += .2;
  this.soyuz2.rotationZ += .01;

  // this.camera.x = Math.sin(time/4) * 50;
  this.camera.y = Math.cos(time / 4) * 10;
  // this.camera.z = Math.sin(time/4) * 50;
  this.camera.z = 50;

  this.renderer.render();

  requestAnimationFrame(this.enterFrameHandler.bind(this))
}

inherits(World, AbstractWorld);


window.onload = function () {
  DatGuiUtil.initialize();

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

  SHADER_LOADER.load(function(data){

    SHADER_LOADER.loadedData = data;
    //テクスチャ画像リスト
    var texturePashArray = ["images/nobi.fw.png","images/gian.fw.png","images/suneo.fw.png","images/dora.fw.png","images/dorami.fw.png","images/sizu.fw.png"];
    //テクスチャ画像をImage要素としての読み込み
    ImageLoader.load(texturePashArray, loadCompleteHandler);
  });

};