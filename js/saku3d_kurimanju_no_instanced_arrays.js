var World = function () {
  //superクラスのコンストラクタを実行
  AbstractWorld.call(this, "canvasId", "aaaa");
}

World.prototype = {
  init: function () {
    console.log("World.init")

    this.camera = new Camera(this.canvas);
    this.light = new DirectionLight();
    this.light.lightDirection = [1, 1, 2];
    this.scene3D = new Scene3D(this.gl, this.camera, this.light);
    this.renderer = new Renderer(this.gl, this.scene3D, SHADER_LOADER.loadedData);
    this.meshList = [];
    this.length = 1;

    var srcFiles1 = {
      obj: "models/kurimanju.obj",
      mtl: "models/kurimanju.mtl"
    }
    ObjLoader.load(srcFiles1, (function (modelData) {
      this.modelData = modelData;
      this.setKurimanju();
      this.enterFrameHandler();
      this.setDatguil();

      this.clearIndex = setInterval((function(){
        this.length *= 2;
        if(this.length > 3000) this.length = 1;
        this.setKurimanju();
        for (var i in DatGuiUtil.f.__controllers) {
          DatGuiUtil.f.__controllers[i].updateDisplay();
        }
      }).bind(this), 1000);
    }).bind(this));
  },
  stopAutoIncrement:function(){
    clearInterval(this.clearIndex)
  },

  setDatguil: function(){
    DatGuiUtil.f = DatGuiUtil.gui.addFolder('Kurimanju');
    DatGuiUtil.f.open();
    var control = DatGuiUtil.f.add(this,"length",1,5000);
    control.onChange( (function(value){
      this.stopAutoIncrement();
      this.scene3D.removeAllChildren();
      this.meshList = [];
      this.setKurimanju(parseInt(value))
    }).bind(this));
    DatGuiUtil.f.add(this,"stopAutoIncrement");
  },
  calcNormal: function calcNormal() {
    var r1 = Math.random();
    var r2 = Math.random();
    var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
    value = (value + 3) / 6;
    return value;
  },

  setKurimanju: function(){
    var length = this.length - this.meshList.length;
    for(var i = 0; i < length; i++){
      var mesh = new Kurimanju(this.gl, this.scene3D, {
        modelData: this.modelData,
        specularIndex: 2,
        isAutoIncrement: true,
        isInstancedArray: false
      });
      mesh.defaultX = (this.calcNormal()-.5) * 10;
      mesh.defaultY = (this.calcNormal()-.5) * 10;
      mesh.defaultZ = (this.calcNormal()-.5) * 10;
      mesh.rnd = Math.random() * Math.PI;

      mesh.setScale(.02);
      this.scene3D.addChild(mesh);
      this.meshList.push(mesh);
    }
  },

  enterFrameHandler: function () {
    var time = CLOCK.getElapsedTime() / 1000;
    this.camera.z = (Math.sin(time / 3) + 1) * 10;
    // this.camera.z = 10;
    for(var i= 0, l=this.meshList.length; i < l; i++){
      this.meshList[i].x = Math.sin(time / 3 * this.meshList[i].rnd + this.meshList[i].rnd) * .2 + this.meshList[i].defaultX;
      this.meshList[i].z = Math.cos(time / 4 * this.meshList[i].rnd+ this.meshList[i].rnd) * .2 + this.meshList[i].defaultZ;
      this.meshList[i].y = Math.sin(time / 5  * this.meshList[i].rnd+ this.meshList[i].rnd) * .2 + this.meshList[i].defaultY;
    }

    this.renderer.render();
    requestAnimationFrame(this.enterFrameHandler.bind(this))
  },
  onResizeCanvas: function () {
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.camera.aspect = this.canvas.width / this.canvas.height;
  }
}

inherits(World, AbstractWorld);


window.onload = function () {
  DatGuiUtil.initialize();

  SHADER_LOADER.load(function (data) {
    SHADER_LOADER.loadedData = data;
    new World();
  });
};
