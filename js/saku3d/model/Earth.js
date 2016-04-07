Earth = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

Earth.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 1.0;
    this.diffuseIntensity = 2.0;
    this.specularIndex = 1;
    this.programIndex = 2;
    this.isFlatShade = false;
    this.isTexture = true;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    var diffuseMapSource = ImageLoader.images["images/explosion2.png"];
    // this.initTexture(diffuseMapSource, "diffuse");

    //
    this.initTexture(initObject.textureCanvas, "diffuse");
  },
  setTexture: function(img){
    this.initTexture(img, "diffuse");
  },

  initTexture: function (img, type) {
    // テクスチャオブジェクトの生成
    this.textureObject[type] = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObject[type]);
    // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  },
  renderBefore:function(){
    this.time = CLOCK.getElapsedTime() / 800000;
  }
};

inherits(Earth,AbstractModel);

