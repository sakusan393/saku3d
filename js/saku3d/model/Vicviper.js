Vicviper = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

Vicviper.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isFlatShade = true;
    this.isLookAt = false;
    this.isTexture = true;
    this.isMoveForward = false;
    this.alpha = 1.0;
    this.specularIndex = 0;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    var diffuseMapSource = ImageLoader.images["models/vicviper_mirror_fix.png"];
    this.initTexture(diffuseMapSource, "diffuse");
  }
}

inherits(Vicviper,AbstractModel);
