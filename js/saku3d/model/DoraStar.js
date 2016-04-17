DoraStar = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

DoraStar.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 1;
    this.diffuseIntensity = 3;
    this.specularIntensity = .8;
    this.specularIndex = 1;
    this.programIndex = 2;
    this.isFlatShade = true;
    this.isTexture = true;
    this.cullingIndex = 1;
    this.spikeRatio = 1;
    this.detailRatio = 1;
    this.gainRatio = 1;
    this.timeRatio = 1;
    this.charactors = 0;

    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    var diffuseMapSource = ImageLoader.images["images/dora.png"];
    // this.initTexture(diffuseMapSource, "diffuse");


    var imageArray = ["images/dora.fw.png","images/nobi.fw.png","images/sizu.fw.png","images/gian.fw.png","images/suneo.fw.png","images/dorami.fw.png"];
    this.canvasTextureUtil = new ImageFadeUtil(CLOCK,imageArray);
    var canvas = this.canvasTextureUtil.update();
    this.initTexture(canvas, "diffuse");
    this.setTexture(canvas);

    this.setDatguil();
  },
  setDatguil: function(){
    DatGuiUtil.gui.add(this,"spikeRatio",-2.0,2.0);
    DatGuiUtil.gui.add(this,"detailRatio",0.0,6.0);
    DatGuiUtil.gui.add(this,"gainRatio",-100.0,100.0);
    DatGuiUtil.gui.add(this,"timeRatio",0.0,10.0);
    var controller = DatGuiUtil.gui.add(this,"charactors",{Doraemon:0,Nobita:1,Shizuka:2,Gian:3,Suneo:4,Dorami:5})
    controller.onChange( (function(value){
      console.log(this.canvasTextureUtil, +value);
    }).bind(this));
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
    this.setTexture(this.canvasTextureUtil.update());
    this.time = CLOCK.getElapsedTime() / 160000;
  }
};

inherits(DoraStar,AbstractModel);

