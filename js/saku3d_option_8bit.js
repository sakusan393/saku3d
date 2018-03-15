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

  var srcFiles1 = {
    obj: "models/option.obj",
    mtl: "models/option.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    console.log(this)
    this.vicviper = new Option(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.vicviper.setScale(0.3);
    this.vicviper.x = -1;
    // this.vicviper.rotationX = 10;
    this.vicviper2 = new Option(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.vicviper2.setScale(0.3);
    this.vicviper2.x = 1;
    // this.vicviper2.rotationX = 10;

    this.scene3D.addChild(this.vicviper);
    this.scene3D.addChild(this.vicviper2);
    this.enterFrameHandler();
    this.onResizeCanvas();
  }).bind(this));
}
World.prototype.enterFrameHandler = function () {
  this.vicviper.rotationY += .3;
  this.vicviper2.rotationY += .3;



  var scale = Math.sin(CLOCK.getElapsedTime()*.6) * 0.03 + 0.2;
  this.vicviper.setScale(scale);
  this.vicviper2.setScale(scale);

  this.renderer.render();
  requestAnimationFrame(this.enterFrameHandler.bind(this))
};
World.prototype.onResizeCanvas = function () {
  var screenWidth = 256/8;
  var screenHeight = 240/8;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  this.renderer.setSize()
  this.gl.viewport(0, 0, screenWidth, screenHeight);
  this.camera.aspect = screenWidth / screenHeight;
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
