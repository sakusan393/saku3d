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
  this.postProcessEffect.setCurrentProgram('mosaic')
  // this.scene3D.addPostProcess(this.postProcessEffect);


  var srcFiles1 = {
    obj: "models/moai.obj",
    mtl: "models/moai.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    console.log(this)
    this.vicviper = new Moai(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.vicviper.setScale(1);
    this.vicviper.x = -1;
    this.vicviper.rotationX = 270;
    this.vicviper.rotationZ = 0;
    this.vicviper.scale = 2;
    this.vicviper2 = new Moai(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.vicviper2.setScale(1);
    this.vicviper2.is8bitColor = true;
    this.vicviper2.x = 1;
    this.vicviper2.rotationX = 270;
    this.vicviper2.rotationZ = 0;

    this.scene3D.addChild(this.vicviper);
    this.scene3D.addChild(this.vicviper2);
    this.enterFrameHandler();
  }).bind(this));
}
World.prototype.enterFrameHandler = function () {
  this.vicviper.rotationY += .3;
  this.vicviper2.rotationY += .3;
  this.renderer.render();
  requestAnimationFrame(this.enterFrameHandler.bind(this))
};
World.prototype.onResizeCanvas = function () {
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  this.renderer.setSize()
  this.gl.viewport(0, 0, screenWidth, screenHeight);
  this.camera.aspect = screenWidth / screenHeight;
  this.postProcessEffect.updateTextureSize(screenWidth, screenHeight);
};

inherits(World, AbstractWorld);


window.onload = function () {


  SHADER_LOADER.load(function(data){
    SHADER_LOADER.loadedData = data;
    new World();
  });


  //テクスチャ読み込み後の処理
  // var loadCompleteHandler = function () {
  //   //ドキュメントクラス的なもの canvasのIDを渡す
  //   var initialize = function (returnValue) {
  //     for (var val in ImageLoader.images) {
  //       console.log("loaded : ", ImageLoader.images[val]);
  //     }
  //   };
  // };
  // //テクスチャ画像リスト
  // var texturePashArray = ["images/texturengundam.png", "images/texturefunnel.png", "images/texturefunnel_n.png", "images/texturesazabycokpit.jpg", "images/texturestar.png", "images/space.jpg", "images/texturesazabycokpit_n.png"];
  // //テクスチャ画像をImage要素としての読み込み
  // ImageLoader.load(texturePashArray, loadCompleteHandler);
};
