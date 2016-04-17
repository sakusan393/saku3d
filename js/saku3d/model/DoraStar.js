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
    this.specularIntensity = .2;
    this.specularIndex = 2;
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
    this.canvasTextureUtil.setCallback(this.changeTextureHandler.bind(this))

    this.setDatguil();
  },
  changeTextureHandler:function(value){
    console.log('changeTextureHandler:value : ', value%6, this.spikeRatio);
    var spikeRatio = 1.0;
    var detailRatio = 1.0;
    var gainRatio = 1.0;
    var timeRatio = 1.0;
    switch (value%6){
      case 0:{
        spikeRatio = 1.0;
        detailRatio = 1.0;
        gainRatio = 1.0;
        timeRatio = 1.0;
        break;
      }
      case 1:{
        spikeRatio = 1.3;
        detailRatio = 1.2;
        gainRatio = 1.0;
        timeRatio = 0.5;
        break;
      }
      case 2:{
        spikeRatio = 1.2;
        detailRatio = 1.1;
        gainRatio = 1.0;
        timeRatio = 1.0;
        break;
      }
      case 3:{
        spikeRatio = .9;
        detailRatio = 0.7;
        gainRatio = 1.0;
        timeRatio = 2.0;
        break;
      }
      case 4:{
        spikeRatio = 1.5;
        detailRatio = 1.8;
        gainRatio = 1.0;
        timeRatio = 1.5;
        break;
      }
      case 5:{
        spikeRatio = 1.0;
        detailRatio = 1.1;
        gainRatio = 1.0;
        timeRatio = 1.0;
        break;
      }
    }
    TweenLite.to(this,.5,{spikeRatio:spikeRatio,detailRatio:detailRatio,gainRatio:gainRatio,timeRatio:timeRatio});
  },
  setDatguil: function(){
    var f = DatGuiUtil.gui.addFolder('Star');
    f.open();
    var controller = f.add(this,"charactors",{Doraemon:0,Nobita:1,Shizuka:2,Gian:3,Suneo:4,Dorami:5});
    f.add(this,"spikeRatio",-2.0,2.0).listen();
    f.add(this,"detailRatio",0.0,6.0).listen();
    f.add(this,"gainRatio",-100.0,100.0).listen();
    f.add(this,"timeRatio",0.0,10.0).listen();
    controller.onChange( (function(value){
      console.log(this.canvasTextureUtil, +value);
      this.charactors = +value;
      this.canvasTextureUtil.setTextureIndex(value - 1)
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

