Moai = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

Moai.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.alpha = 1.0;
    this.diffuseIntensity = 1.6;
    this.specularIntensity = 0.4;
    this.isFlatShade = false;
    this.specularIndex = 2;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  }
}

inherits(Moai,AbstractModel);
