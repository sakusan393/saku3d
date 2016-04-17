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
  this.callback = null;

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
    this.currentImage = this.imageArray[0];
    this.prevImage = this.imageArray[0];
    this.clearIntervalIndex = 0;
    this.startAutoTextureChange(3000);
    this.currentTime = this.CLOCK.getElapsedTime();
    this.update();
  },
  setCallback:function(callback){
    this.callback = callback;
  },
  getDeltaTime:function(){
    var nowTime = this.CLOCK.getElapsedTime();
    var deltaTime = nowTime - this.currentTime;
    return deltaTime * 0.002;
  },
  startAutoTextureChange:function(diffTime){
    clearInterval(this.clearIntervalIndex);
    this.clearIntervalIndex = setInterval((function(){
      this.counter++;
    }).bind(this),diffTime)
  },
  setTextureIndex:function(textureIndex){
    clearInterval(this.clearIntervalIndex);
    this.counter = 1;
    this.imageCounter = textureIndex;
    // this.startAutoTextureChange(10000);
  },

  fadeIn:function(){
    if(this.alpha == 1) return;
    this.alpha += this.getDeltaTime();
    if(this.alpha > 1){
      this.alpha = 1;
      this.prevImage = this.currentImage;
    }
  },
  fadeOut:function(){
    if(this.alpha == 0) return;
    this.alpha -= this.getDeltaTime();
    if(this.alpha < 0){
      this.alpha = 0;
      this.counter++;
      this.imageCounter++;
      var length = this.imageArray.length;
      console.log(this.imageCounter%length)
      this.currentImage = this.imageArray[this.imageCounter%length];
      if(this.callback) this.callback(this.imageCounter);
    }
  },
  update: function () {

    if(this.counter%2==0){
      this.fadeIn()
    }else{
      this.fadeOut()
    }
    // console.log(this.currentImage)
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    // this.ctx.fillStyle = "rgb(50, 50, 200)";
    this.ctx.fillRect(0,0,this.imageWidth,this.imageHeight)
    // this.ctx.drawImage(this.prevImage,0,0);
    this.ctx.globalAlpha = this.alpha;
    this.ctx.drawImage(this.currentImage,0,0);
    this.currentTime = this.CLOCK.getElapsedTime();
    return this.ctx.canvas;
  }
};
