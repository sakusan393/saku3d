Cube = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  initObject = {}
  console.log("aal", window.cube(1))
  initObject.modelData = window.cube(1);
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

Cube.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 1.0;
    this.diffuseIntensity = 3.0;
    this.specularIndex = 0;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  }
}

inherits(Cube,AbstractModel);
