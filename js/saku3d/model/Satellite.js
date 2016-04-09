Satellite = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  // initObject.renderBefore = this.renderBefore;
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

Satellite.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.isFlatShade = true;
    this.alpha = 10;
    this.diffuseIntensity = .8;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  }
}

inherits(Satellite,AbstractModel);
