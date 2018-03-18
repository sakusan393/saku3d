var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype.init = function () {
  console.log("World.init")

  this.camera = new Camera(this.canvas);
  this.camera.lookPoint = [0,0,0];
  this.camera.fov = Math.PI / 180 * 45;
  this.light = new DirectionLight();
  this.light.lightDirection = [0,0,3];
  this.scene3D = new Scene3D(this.gl, this.camera, this.light);
  this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);

  this.mesh = new Bubble(this.gl,this.scene3D
    , {modelData:  window.sphere(60, 60,15), specularIndex: 1});
  this.mesh2 = new Bubble(this.gl,this.scene3D
    , {modelData:  window.sphere(60, 60,15), specularIndex: 1});

  this.mesh.x = 20;
  this.mesh2.x = -20;

  this.scene3D.addChild(this.mesh);
  this.scene3D.addChild(this.mesh2);
  this.enterFrameHandler();
  this.onResizeCanvas();
}
World.prototype.enterFrameHandler = function () {
  // this.mesh.rotationY += .3;
  // this.mesh2.rotationY += .3;
  this.camera.x = Math.sin(CLOCK.getElapsedTime() / 1000) * 4;
  this.camera.y = Math.cos(CLOCK.getElapsedTime() / 1000) * 4;
  this.camera.z = 50;

  this.renderer.render();

  requestAnimationFrame(this.enterFrameHandler.bind(this))
};
World.prototype.onResizeCanvas = function () {
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;
  this.canvas.width = screenWidth;
  this.canvas.height = screenHeight;
  this.renderer.setSize();
  this.gl.viewport(0, 0, screenWidth, screenHeight);
  this.camera.aspect = screenWidth / screenHeight;
};

inherits(World, AbstractWorld);


window.onload = function () {

  SHADER_LOADER.load(function(data){
    SHADER_LOADER.loadedData = data;
    new World();
  });
};
