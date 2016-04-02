Vicviper = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);
}

Vicviper.prototype = {
  initialize: function (initObject) {
    //拡張用
    this.beamLength = 20;
    this.beamArray = [];
    this.curentBeamIndex = 0;
    this.currentBeam = null;
    this.isLightEnable = true;
    this.isObjData = true;
    this.alpha = 0.0;
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
