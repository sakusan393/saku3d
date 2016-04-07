JetEngine = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  // initObject.renderBefore = this.renderBefore;
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

JetEngine.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.isFlatShade = true;
    this.alpha = 1.0;
    this.diffuseIntensity = 2.5;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  },
  renderBefore:function(){
    // console.log(111)
    // this.time = CLOCK.getElapsedTime() / 10000;
  }
}

inherits(JetEngine,AbstractModel);
