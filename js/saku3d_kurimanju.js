var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.light = new DirectionLight();
  this.light.lightDirection = [0,1,0];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  var srcFiles1 = {
    obj: "models/kurimanju.obj",
    mtl: "models/kurimanju.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    console.log(this)
    this.mesh = new Kurimanju(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.mesh.setScale(.02);
    this.scene3D.addChild(this.mesh);
    this.enterFrameHandler();
  }).bind(this));
}
World.prototype.enterFrameHandler = function () {
  this.mesh.rotationY += .3;
  this.mesh.rotationZ = 20;
  var time = CLOCK.getElapsedTime() / 1000;
  this.camera.z = (Math.sin(time/2) + 1) * 4;
  // this.camera.x = Math.sin(time/3) * 4;

  this.renderer.render();
  requestAnimationFrame(this.enterFrameHandler.bind(this))
}

inherits(World, AbstractWorld);


window.onload = function () {


  SHADER_LOADER.load(function(data){
    SHADER_LOADER.loadedData = data;
    new World();
  });
};
