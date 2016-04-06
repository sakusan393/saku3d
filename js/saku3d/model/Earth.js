Earth = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

Earth.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 1.0;
    this.diffuseIntensity = 1.0;
    this.specularIndex = 2;
    this.isFlatShade = false;
    this.isTexture = false;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    // var diffuseMapSource = ImageLoader.images["images/beans.jpg"];
    // this.initTexture(diffuseMapSource, "diffuse");
  }
};

inherits(Earth,AbstractModel);

