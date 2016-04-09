LinearGradientUtil = function (clock) {
  //superクラスのコンストラクタを実行

  this.CLOCK = clock;
  this.imageWidth = 256;
  this.imageHeight = 256;
  this.imageElement = new Image();
  this.imageElement.width = this.imageWidth;
  this.imageElement.height = this.imageHeight;

  this.initialize();
};

LinearGradientUtil.prototype = {
  initialize: function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.imageWidth
    canvas.height = this.imageHeight
    this.ctx = canvas.getContext('2d');
    this.imgdata = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.data = this.imgdata.data;
    this.update();
  },
  update: function () {
    var t = this.CLOCK.getElapsedTime() * 0.006;
    for (var x = 0; x < this.imageWidth; x++) {
      for (var y = 0; y < this.imageHeight; y++) {
        var r = this.simplex.noise3D(x / 60, y / 60, t/100) * 0.5 + 0.5;
        var g = this.simplex.noise3D(x / 40, y / 140, t/100) * 0.5 + 0.5;
        this.data[(x + y * 256) * 4 + 0] = r * 80;
        this.data[(x + y * 256) * 4 + 1] = (g) * 200;
        this.data[(x + y * 256) * 4 + 2] = (r+g) * 100;
        this.data[(x + y * 256) * 4 + 3] = 255;
      }
    }
    this.ctx.putImageData(this.imgdata, 0, 0);
    return this.ctx.canvas;
  }
};
