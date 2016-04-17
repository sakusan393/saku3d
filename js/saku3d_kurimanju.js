var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.light = new DirectionLight();
  this.light.lightDirection = [1,1,2];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  var srcFiles1 = {
    obj: "models/kurimanju.obj",
    mtl: "models/kurimanju.mtl"
  };
  ObjLoader.load(srcFiles1, (function(modelData){
    this.mesh = new Kurimanju(this.gl, this.scene3D, {modelData: modelData, specularIndex: 2});
    this.mesh.setScale(.02);
    this.scene3D.addChild(this.mesh);
    this.enterFrameHandler();
  }).bind(this));
}
World.prototype.enterFrameHandler = function () {
  var time = CLOCK.getElapsedTime() / 1000;
  this.mesh.rotationY += .1;
  this.mesh.rotationZ = (Math.sin(time/2) + 1) * 4;
  // this.mesh.rotationX += .02;
  this.camera.z = (Math.sin(time/3) + 1) * 4;
  // this.camera.z = 20;

  this.renderer.render();
  requestAnimationFrame(this.enterFrameHandler.bind(this))
}

inherits(World, AbstractWorld);


window.onload = function () {
  DatGuiUtil.initialize();

  SHADER_LOADER.load(function(data){
    SHADER_LOADER.loadedData = data;
    new World();
  });
};
