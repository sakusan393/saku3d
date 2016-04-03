var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.camera.z = 60;
  this.camera.y = 10;
  this.light = new DirectionLight();
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);

  this.optionLength = 100;

  var srcFiles1 = {
    obj: "models/vicviper_mirror_fix.obj",
    mtl: "models/vicviper_mirror_fix.mtl"
  };
  var srcFiles2 = {
    obj: "models/option.obj",

    mtl: "models/option.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    this.vicviper = new Vicviper(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.vicviper.setScale(0.3);
    this.vicviper.x = 1;
    this.vicviper.rotationX = 0;

    this.scene3D.addChild(this.vicviper);
    this.scene3D.addChild(this.vicviper);

    ObjLoader.load(srcFiles2, (function(modelData){
      this.options = [];
      for(var i = 0 ; i < this.optionLength; i++){
        this.option = new Option(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
        this.option.setScale(0.3);
        this.option.rotationX = 0;
        this.option.isMoveForward = true;
        this.options.push(this.option)

        this.scene3D.addChild(this.option);

      }
      this.enterFrameHandler();
    }).bind(this));

  }).bind(this));


}
World.prototype.enterFrameHandler = function () {


  var time = CLOCK.getElapsedTime() * 0.001;
  this.vicviper.x = Math.sin(time) * 15;
  this.vicviper.y = Math.cos(time*2) * 5;
  this.vicviper.z = Math.cos(time) * 34;

  for(var i= 0; i < this.optionLength; i++){
    var scale = Math.sin(CLOCK.getElapsedTime()*.6) * 0.03 + 0.2;
    var option = this.options[i];
    option.setScale(scale);
    option.rotationY += .3;
    var target;
    if(i == 0){
      target = this.vicviper
    }else{
      target = this.options[i-1];
    }
    option.x += (target.x - option.x) * 0.07;
    option.y += (target.y - option.y) * 0.07;
    option.z += (target.z - option.z) * 0.07;
  }


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
  };
  new World();

  // //テクスチャ画像リスト
  // var texturePashArray = ["images/texturengundam.png", "images/texturefunnel.png", "images/texturefunnel_n.png", "images/texturesazabycokpit.jpg", "images/texturestar.png", "images/space.jpg", "images/texturesazabycokpit_n.png"];
  // //テクスチャ画像をImage要素としての読み込み
  // ImageLoader.load(texturePashArray, loadCompleteHandler);
};
