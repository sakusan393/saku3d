Bubble = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

Bubble.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 0.3;
    this.diffuseIntensity = 4;
    this.specularIntensity = 1;
    this.specularIndex = 1;
    this.programIndex = 2;
    this.isFlatShade = false;
    this.isTexture = false;
    this.cullingIndex = 1;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    this.spikeRatio = 1;
    this.detailRatio = .1;
    this.gainRatio = 1;
    this.timeRatio = 1;
  },
  setTexture: function (img) {

  },

  initTexture: function (img, type) {
    // テクスチャオブジェクトの生成
  },
  renderBefore: function () {
    this.time = CLOCK.getElapsedTime() / 160000;
  }
};

inherits(Bubble, AbstractModel);

