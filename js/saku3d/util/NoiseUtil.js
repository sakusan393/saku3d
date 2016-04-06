NoiseUtil = function (simplexNoise, clock) {
  //superクラスのコンストラクタを実行

  this.CLOCK = clock;
  this.imageWidth = 256;
  this.imageHeight = 256;
  this.imageElement = new Image();
  this.imageElement.width = this.imageWidth;
  this.imageElement.height = this.imageHeight;

  this.initialize(simplexNoise);
};

NoiseUtil.prototype = {
  initialize: function (simplexNoise) {
    this.simplex = simplexNoise;
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    this.ctx = canvas.getContext('2d');
    this.imgdata = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.data = this.imgdata.data;
  },
  update: function () {
    var t = this.CLOCK.getElapsedTime() * 0.02;
    for (var x = 0; x < 256; x++) {
      for (var y = 0; y < 256; y++) {
        var r = this.simplex.noise3D(x / 30, y / 30, t / 100) * .1 + 0.5;
        var g = this.simplex.noise3D(x / 40, y / 40, t / 100) * .1 + 0.5;
        this.data[(x + y * 256) * 4 + 0] = r * 100;
        this.data[(x + y * 256) * 4 + 1] = (g * r) * 200;
        this.data[(x + y * 256) * 4 + 2] = (r - g) * 100;
        this.data[(x + y * 256) * 4 + 3] = 255;
      }
    }
    this.ctx.putImageData(this.imgdata, 0, 0);
    return this.ctx.canvas;
  }
};
