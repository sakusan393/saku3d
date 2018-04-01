F393 = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  // initObject.renderBefore = this.renderBefore;
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

F393.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.isFlatShade = false;
    this.isPoint = false;
    this.is8bitColor = false;
    this.programIndex = 0;
    this.alpha = 1.0;
    this.diffuseIntensity = 2;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  },
  renderBefore:function(){
    this.time = CLOCK.getElapsedTime() / 10000;
  }
}

inherits(F393,AbstractModel);
