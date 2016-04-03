Option = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);
}

Option.prototype = {
  initialize: function (initObject) {
    //拡張用
    this.isLightEnable = true;
    this.isObjData = false;
    this.alpha = 1.0;
    this.specularIndex = 0;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  }
}

inherits(Option,AbstractModel);
