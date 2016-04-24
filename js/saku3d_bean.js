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

  this.postProcessEffect = new PostProcessEffect(this.gl);
  this.postProcessEffect.init(this.canvas.width, this.canvas.height);
  this.scene3D.addPostProcess(this.postProcessEffect);
  this.renderer.setPostProcess(this.postProcessEffect);

  this.mesh = new Bean(this.gl,this.scene3D
    , {modelData:  window.sphere(20, 20, .3), specularIndex: 1});

  this.scene3D.addChild(this.mesh);
  this.enterFrameHandler();
};
World.prototype.enterFrameHandler = function () {
  this.mesh.rotationY += .3;
  this.mesh.rotationY += .3;

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
    var texturePashArray = ["images/beans.jpg"];
    //テクスチャ画像をImage要素としての読み込み
    ImageLoader.load(texturePashArray, loadCompleteHandler);
  });
};
