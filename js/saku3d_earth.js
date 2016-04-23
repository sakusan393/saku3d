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
  this.light.lightDirection = [0,0,3];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  // this.canvasTextureUtil = new NoiseUtil(new SimplexNoise(), CLOCK);
  // var canvas = this.canvasTextureUtil.update();
  var imageDataArray = ["images/explosion.png","images/explosion2.png"];
  this.canvasTextureUtil = new ImageFadeUtil(CLOCK,imageDataArray);
  var canvas = this.canvasTextureUtil.update();

  this.water = new WaterBall(this.gl,this.scene3D
    , {modelData:  window.sphere(60, 60, 12.5, [0,0,1,1.0]), specularIndex: 1, programIndex:0});

  this.mesh = new Earth(this.gl,this.scene3D
    , {modelData:  window.sphere(60, 60,15), specularIndex: 1, textureCanvas:canvas});

  var srcFiles1 = {
    obj: "models/soyuz.obj",
    mtl: "models/soyuz.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData) {
    this.jetEngine = new Satellite(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.jetEngine.setScale(5);

    this.scene3D.addChild(this.jetEngine);

    var srcFiles2 = {
      obj: "models/soyuz2.obj",
      mtl: "models/soyuz2.mtl"
    };
    ObjLoader.load(srcFiles2, (function(modelData) {
      this.soyuz2 = new Satellite(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
      this.soyuz2.setScale(3);

      this.scene3D.addChild(this.soyuz2);
      this.scene3D.addChild(this.mesh);
      this.scene3D.addChild(this.water);
      this.enterFrameHandler();
    }).bind(this));


  }).bind(this));

}
World.prototype.enterFrameHandler = function () {


  this.mesh.rotationY = 80;
  this.mesh.rotationX += .002;
  var canvas = this.canvasTextureUtil.update();
  this.mesh.setTexture(canvas);

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
  this.soyuz2.rotationZ += .05

  this.camera.x = Math.sin(time/4) * 50;
  this.camera.y = Math.cos(time* .0010) * 10;
  this.camera.z = Math.cos(time/4) * 50;
  // this.camera.z = 80;

  this.renderer.render();

  requestAnimationFrame(this.enterFrameHandler.bind(this))
};
World.prototype.onResizeCanvas = function () {
  this.canvas.width = document.documentElement.clientWidth;
  this.canvas.height = document.documentElement.clientHeight;
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  this.camera.aspect = this.canvas.width / this.canvas.height;
};

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

  SHADER_LOADER.load(function(data){

    SHADER_LOADER.loadedData = data;
    //テクスチャ画像リスト
    var texturePashArray = ["images/explosion.png","images/explosion2.png"];
    //テクスチャ画像をImage要素としての読み込み
    ImageLoader.load(texturePashArray, loadCompleteHandler);
  });

};
