WaterBall = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

WaterBall.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isPoint = false;
    this.alpha = 0.6;
    this.diffuseIntensity = 1.0;
    this.specularIntensity = .2;
    this.specularIndex = 1;
    this.programIndex = 0;
    this.cullingIndex = 1;//0:none, 1:back, 2:Front
    this.isFlatShade = true;
    this.isTexture = false;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    // var diffuseMapSource = ImageLoader.images["images/beans.jpg"];
    // this.initTexture(diffuseMapSource, "diffuse");

    // this.setDatguil();
  },
  setDatguil: function(){
    this.programIndex = 2;
    this.spikeRatio = 1.0;
    this.gainRatio = 1.0;
    this.timeRatio = 1.0;
    var folder = DatGuiUtil.gui.addFolder('Sea');
    folder.add(this,"spikeRatio",-100.0,100.0);
    folder.add(this,"gainRatio",-100.0,100.0);
    folder.add(this,"timeRatio",0.0,10.0);
  },
  renderBefore:function(){
    this.time = CLOCK.getElapsedTime() / 160000;
  },
};

inherits(WaterBall,AbstractModel);

