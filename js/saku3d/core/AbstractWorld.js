var AbstractWorld = function (canvasId) {
  this.gl = this.initWebglContext(canvasId);
  this.addEvent();
  this.init();
};

AbstractWorld.prototype = {

  initWebglContext: function (canvasId) {

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", canvasId);
    document.body.appendChild(this.canvas);

    this.setCanvasSize();
    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    if (!this.gl) {
      alert("no support webgl");
      return null
    }
    return this.gl
  },
  addEvent: function(){
    window.addEventListener('resize', this.onResizeCanvas.bind(this));
  },
  removeEvent: function(){
    window.removeEventListener('resize', this.onResizeCanvas.bind(this));
  },

  setCanvasSize: function () {
    console.log("set")
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // this.canvas.width = 300
    // this.canvas.height = 200
  },

  onResizeCanvas: function(){
    this.setCanvasSize();
  },

  init: function () {
    this.enterFrameHandler()
  },

  enterFrameHandler: function () {
    requestAnimationFrame(this.enterFrameHandler.bind(this))
  }
};
