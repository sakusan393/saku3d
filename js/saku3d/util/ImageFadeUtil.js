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

    this.alpha = 1;
    this.counter = 0;
    this.imageCounter = 0;
    this.imageArray = [];
    this.imageArray.push(ImageLoader.images["images/dora.png"])
    this.imageArray.push(ImageLoader.images["images/dorami.png"])
    this.image = ImageLoader.images["images/dora.png"];
    setInterval((function(){
      this.counter++;
    }).bind(this),5000)
    this.update();
  },
  fadeIn:function(){
    if(this.alpha >= 1) return;
    this.alpha += this.CLOCK.getDelta() * 0.001;
    if(this.alpha > 1) this.alpha = 1;
  },
  fadeOut:function(){
    if(this.alpha <= 0) return;
    this.alpha -= this.CLOCK.getDelta() * 0.001;
    if(this.alpha < 0){
      this.alpha = 0;
      this.counter++;
      this.imageCounter++;
      this.image = this.imageArray[this.imageCounter%2]
    }
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
    this.ctx.drawImage(this.image,0,0);
    return this.ctx.canvas;
  }
};
