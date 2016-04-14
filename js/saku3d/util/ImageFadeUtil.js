ImageFadeUtil = function (clock) {
  //superクラスのコンストラクタを実行

  this.CLOCK = clock;
  this.imageWidth = 8;
  this.imageHeight = 256;
  this.imageElement = new Image();
  this.imageElement.width = this.imageWidth;
  this.imageElement.height = this.imageHeight;

  this.initialize();
};

ImageFadeUtil.prototype = {
  initialize: function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.imageWidth
    canvas.height = this.imageHeight
    this.ctx = canvas.getContext('2d');
    // this.imgdata = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    // this.data = this.imgdata.data;

    this.ctx.drawImage(ImageLoader.images["images/dorami.png"],0,0)
    this.update();
    this.alpha = 1;
    this.counter = 0;
    this.imageArray = [];
    this.imageArray.push(ImageLoader.images["images/dora.png"])
    this.imageArray.push(ImageLoader.images["images/dorami.png"])
    setInterval((function(){
      this.counter++;
    }).bind(this),5000)
  },
  fadeIn:function(){
    if(this.alpha >= 1) return;
    this.alpha += this.CLOCK.getDelta() * 0.001;
    if(this.alpha > 1) this.alpha = 1;
  },
  fadeOut:function(){
    if(this.alpha <= 0) return;
    this.alpha -= this.CLOCK.getDelta() * 0.001;
    if(this.alpha < 0) this.alpha = 0;
  },
  update: function () {
    if(this.counter%2==0){
      this.fadeIn()
    }else{
      this.fadeOut()
    }
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    this.ctx.fillRect(0,0,this.imageWidth,this.imageHeight)
    this.ctx.globalAlpha = this.alpha;
    this.ctx.drawImage(ImageLoader.images["images/dorami.png"],0,0)
    // for (var x = 0; x < this.imageWidth; x++) {
    //   for (var y = 0; y < this.imageHeight; y++) {
    //     var r = this.simplex.noise3D(x / 60, y / 60, t/100) * 0.5 + 0.5;
    //     var g = this.simplex.noise3D(x / 40, y / 140, t/100) * 0.5 + 0.5;
    //     this.data[(x + y * 256) * 4 + 0] = r * 80;
    //     this.data[(x + y * 256) * 4 + 1] = (g) * 200;
    //     this.data[(x + y * 256) * 4 + 2] = (r+g) * 100;
    //     this.data[(x + y * 256) * 4 + 3] = 255;
    //   }
    // }
    // this.ctx.putImageData(this.imgdata, 0, 0);
    return this.ctx.canvas;
  }
};
