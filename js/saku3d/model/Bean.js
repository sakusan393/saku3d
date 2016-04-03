Bean = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);
}

Bean.prototype = {
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
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    var diffuseMapSource = ImageLoader.images["images/beans.jpg"];
    this.initTexture(diffuseMapSource, "diffuse");
  }
};

inherits(Bean,AbstractModel);

