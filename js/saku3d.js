var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {

  this.camera = new Camera(this.canvas);
  this.camera.z = 60;
  this.camera.y = 10;
  this.camera.setFov(45);
  this.camera.randmoSeed = Math.random();
  this.light = new DirectionLight();
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  this.optionLength = 60;
  this.cubeLength = 100;

  var srcVicviper = {
    obj: "models/vicviper_mirror_fix.obj",
    mtl: "models/vicviper_mirror_fix.mtl"
  };
  this.modelLoadCount = 0;
  this.modelLoadLength = 3;

  ObjLoader.load(srcVicviper, (function(modelData){
    this.vicviper = new Vicviper(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.vicviper.setScale(0.3);
    this.vicviper.isMoveForward = true;
    this.scene3D.addChild(this.vicviper);
    this.loadedHandler();

    var srcOption = {
      obj: "models/option.obj",
      mtl: "models/option.mtl"
    };
    ObjLoader.load(srcOption, (function(modelData){
      this.options = [];
      var option;

      for(var i = 0 ; i < this.optionLength; i++){
        option = new Option(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
        option.setScale(0.3);
        option.isMoveForward = true;
        this.options.push(option)
        this.scene3D.addChild(option);
      }
      this.loadedHandler()

      var srcBevelCube = {
        obj: "models/bebelcube.obj",
        mtl: "models/bebelcube.mtl"
      };
      ObjLoader.load(srcBevelCube, (function(modelData){
        this.cubes = [];
        var cube;
        for(var i = 0; i <this.cubeLength; i++){
          cube = new BevelCube(this.gl, this.scene3D,{modelData: modelData, specularIndex: 1});
          cube.setScale(1.5);
          cube.x = 100 * (Math.random() - 0.5);
          cube.y = 100 * (Math.random() - 0.5);
          cube.z = 100 * (Math.random() - 0.5);
          cube.rotationX = Math.random() * 100;
          cube.rotationY = Math.random() * 100;
          cube.rotationZ = Math.random() * 100;
          // cube.programIndex = 2;
          this.cubes.push(cube);
          this.scene3D.addChild(cube);
        }
        this.loadedHandler()
      }).bind(this));


    }).bind(this));


  }).bind(this));

}
World.prototype.loadedHandler = function () {
  this.modelLoadCount++;

  if(this.modelLoadCount >= this.modelLoadLength){
    this.camera.lookTarget =  this.vicviper;
    this.enterFrameHandler();
  }

}
World.prototype.enterFrameHandler = function () {


  var time = CLOCK.getElapsedTime() * 0.003;
  this.vicviper.x = Math.sin(time*.2) * 30 * (Math.cos(time*.5)+1);
  this.vicviper.y = Math.cos(time*.6) * 10 * (Math.cos(time*.2)+1);
  this.vicviper.z = Math.cos(time*.3) * 20 * (Math.sin(time*.4)+1);

  this.camera.x = Math.cos(time*.2) * 23 * (Math.cos(time*.003 * (this.camera.randmoSeed + 1)*.5));
  this.camera.y = Math.sin(time*.3) * 10 * (Math.sin(time*.0010 * (this.camera.randmoSeed + 1)*.3)) + 10 * this.camera.randmoSeed;
  this.camera.z = Math.sin(time*.1) * 21 * (Math.cos(time*.0023 * (this.camera.randmoSeed + 1)* .6));


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
    option.x += (target.x - option.x) * 0.15;
    option.y += (target.y - option.y) * 0.15;
    option.z += (target.z - option.z) * 0.15;
  }
  for(i = 0; i <this.cubeLength; i++){
    var cube = this.cubes[i];
    cube.rotationY += .5;
    cube.rotationX += .4;
    cube.rotationZ += .8;
  }


  this.renderer.render();
  requestAnimationFrame(this.enterFrameHandler.bind(this))
}

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
