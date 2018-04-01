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
    obj: "models/face_body_fix.obj",
    mtl: "models/face_body_fix.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    console.log(this)
    this.mesh = new F393(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.mesh.setScale(1.3);
    this.mesh.x = -0.5;
    this.mesh2 = new F393(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
    this.mesh2.setScale(1.3);
    this.mesh2.x = 0.5;
    this.mesh2.is8bitColor = true;

    this.scene3D.addChild(this.mesh);
    this.scene3D.addChild(this.mesh2);
    this.enterFrameHandler();
  }).bind(this));
}
World.prototype.enterFrameHandler = function () {
  var roll = 0.3;
  // this.mesh.rotationX += roll;
  this.mesh.rotationY += roll;
  // this.mesh.rotationZ += roll;
  // this.mesh2.rotationX += roll;
  this.mesh2.rotationY += roll;
  // this.mesh2.rotationZ += roll;

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
