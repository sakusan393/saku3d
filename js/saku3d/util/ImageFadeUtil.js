ImageFadeUtil = function (clock,imageDataArray) {
  //superクラスのコンストラクタを実行

  this.CLOCK = clock;
  if(ImageLoader.images[imageDataArray[0]] && ImageLoader.images[imageDataArray[0]].width)
    this.imageWidth = ImageLoader.images[imageDataArray[0]].width;
  else
    this.imageWidth = 8;
  if(ImageLoader.images[imageDataArray[0]] && ImageLoader.images[imageDataArray[0]].height)
    this.imageHeight = ImageLoader.images[imageDataArray[0]].height;
  else
    this.imageHeight = 256;

  this.imageElement = new Image();
  this.imageElement.width = this.imageWidth;
  this.imageElement.height = this.imageHeight;

  this.initialize(imageDataArray);
};

ImageFadeUtil.prototype = {
  initialize: function (imageDataArray) {
    var canvas = document.createElement("canvas");
    canvas.width = this.imageWidth;
    canvas.height = this.imageHeight;
    this.ctx = canvas.getContext('2d');
    this.alpha = 1;
    this.counter = 0;
    this.imageCounter = 0;
    this.imageArray = [];
    for(var i = 0,l = imageDataArray.length; i < l; i++){
      this.imageArray.push(ImageLoader.images[imageDataArray[i]])
    }
    this.currentImage = ImageLoader.images[imageDataArray[0]];
    this.prevImage = ImageLoader.images[imageDataArray[0]];
    setInterval((function(){
      this.counter++;
    }).bind(this),5000)
    this.update();
  },
  fadeIn:function(){
    if(this.alpha >= 1) return;
    this.alpha += this.CLOCK.getDelta() * 0.001;
    if(this.alpha > 1){
      this.alpha = 1;
      this.prevImage = this.currentImage;
    }
  },
  fadeOut:function(){
    if(this.alpha <= 0) return;
    this.alpha -= this.CLOCK.getDelta() * 0.003;
    if(this.alpha < 0){
      this.alpha = 0;
      this.counter++;
      this.imageCounter++;
      var length = this.imageArray.length;
      console.log(length)

      this.currentImage = this.imageArray[this.imageCounter%length];
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
    // this.ctx.fillStyle = "rgb(50, 50, 200)";
    this.ctx.fillRect(0,0,this.imageWidth,this.imageHeight)
    // this.ctx.drawImage(this.prevImage,0,0);
    this.ctx.globalAlpha = this.alpha;
    this.ctx.drawImage(this.currentImage,0,0);
    return this.ctx.canvas;
  }
};
