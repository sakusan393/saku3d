var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype = {
  init: function () {
    console.log("World.init")

    this.camera = new Camera(this.canvas);
    this.light = new DirectionLight();
    this.scene3D = new Scene3D(this.gl, this.camera, this.light);
    this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

    var srcFiles1 = {
      obj: "models/vicviper_mirror_fix.obj",
      mtl: "models/vicviper_mirror_fix.mtl"
    };
    ObjLoader.load(srcFiles1, (function (modelData) {
      console.log(this)
      this.vicviper = new Vicviper(this.gl, this.scene3D, {modelData: modelData, specularIndex: 1});
      this.vicviper.setScale(0.3);
      this.vicviper.isMoveForward = false;
      this.vicviper.x = -1;
      this.vicviper.rotationX = 40;
      this.vicviper2 = new Vicviper(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
      this.vicviper2.setScale(0.3);
      this.vicviper2.isMoveForward = false;
      this.vicviper2.x = 1;
      this.vicviper2.rotationX = 40;

      this.scene3D.addChild(this.vicviper);
      this.scene3D.addChild(this.vicviper2);
      this.enterFrameHandler();
    }).bind(this));
  },
  onResizeCanvas: function (gl) {
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.camera.aspect = this.canvas.width / this.canvas.height;
  },

  enterFrameHandler: function () {
    this.vicviper.rotationY += .3;
    this.vicviper2.rotationY += .3;

    this.renderer.render();
    requestAnimationFrame(this.enterFrameHandler.bind(this))
  }
};
inherits(World, AbstractWorld);


window.onload = function () {

  //テクスチャ読み込み後の処理
  SHADER_LOADER.load(function(data){
    SHADER_LOADER.loadedData = data;
    new World();
  });
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
