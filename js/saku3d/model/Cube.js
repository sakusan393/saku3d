Cube = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  initObject = {}
  initObject.modelData = window.cube(1.0,[0.5,0.5,1,1]);
  console.log(initObject.modelData.c);
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

Cube.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.isFlatShade = true;
    this.alpha = 0.5;
    this.diffuseIntensity = 1.0;
    this.specularIndex = 1;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
  }
}

inherits(Cube,AbstractModel);
