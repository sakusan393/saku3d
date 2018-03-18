var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.light = new DirectionLight();
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  this.postProcessEffect = new PostProcessEffect(this.gl, SHADER_LOADER.loadedData, this.canvas.width, this.canvas.height);
  this.postProcessEffect.setCurrentProgram('blur');
  this.scene3D.addPostProcess(this.postProcessEffect);

  this.mesh = new Bean(this.gl, this.scene3D
    , {modelData: window.sphere(20, 20, .3), specularIndex: 1});

  this.scene3D.addChild(this.mesh);
  this.enterFrameHandler();
};
World.prototype.enterFrameHandler = function () {
  this.mesh.rotationY += .3;
  this.mesh.rotationY += .3;
  this.camera.x = Math.sin(CLOCK.getElapsedTime() / 1000) * 4;
  this.camera.y = Math.cos(CLOCK.getElapsedTime() / 1000) * 4;
  this.camera.z = Math.cos(CLOCK.getElapsedTime() / 1000) * 4;

  this.renderer.render();

  requestAnimationFrame(this.enterFrameHandler.bind(this))
};
World.prototype.onResizeCanvas = function () {
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  // this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  // this.camera.aspect = this.canvas.width / this.canvas.height;
  //
  this.gl.viewport(0, 0, screenWidth, screenHeight);
  this.camera.aspect = screenWidth / screenHeight;
  this.postProcessEffect.updateTextureSize(screenWidth, screenHeight);
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
  SHADER_LOADER.load(function (data) {
    SHADER_LOADER.loadedData = data;
    //テクスチャ画像リスト
    var texturePashArray = ["images/beans.jpg"];
    //テクスチャ画像をImage要素としての読み込み
    ImageLoader.load(texturePashArray, loadCompleteHandler);
  });
};
