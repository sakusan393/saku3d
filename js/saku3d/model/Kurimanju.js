Kurimanju = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
}

Kurimanju.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.isTexture = false;
    this.isFlatShade = false;
    this.alpha = 1.0;
    this.diffuseIntensity = 1.0;
    this.specularIntensity = 1.0;
    this.specularIndex = 2;
    this.isInstancedArray = true;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    this.instanceLength = 10000;

    this.createInstancedArray();
  },
  setDatguil: function(){
    var f = DatGuiUtil.gui.addFolder('Kurimanju');
    f.open();
    f.add(this,"instanceLength",10,this.instanceLength * 100);
  },

  calcNormal: function calcNormal() {
    // 正規乱数
    var r1 = Math.random();
    var r2 = Math.random();
    var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
    // 値を0以上1未満になるよう正規化する
    value = (value + 3) / 6;
    return value;
  },

  createInstancedArray: function(){
    this.instancedArrayPosition = [];
    this.instancedArrayRandomSeed = [];
    this.offsetPosition = 3;
    console.log(this.modelData.p.length);
    for(var i = 0; i < this.instanceLength * 100; i++){
      this.instancedArrayPosition[i * this.offsetPosition] = (this.calcNormal()-.5) * 200;
      this.instancedArrayPosition[i * this.offsetPosition + 1] = (this.calcNormal()-.5) * 200;
      this.instancedArrayPosition[i * this.offsetPosition + 2] = (this.calcNormal()-.5) * 200;
      this.instancedArrayRandomSeed[i] = Math.random();
    }
    this.setDatguil();
  },
  renderBefore:function(){
    this.time = CLOCK.getElapsedTime() / 300;
  }
}

inherits(Kurimanju,AbstractModel);
