PostProcessEffect = function (gl) {
  //gl context
  this.gl = gl;

  this.effect = {};
  this.frameBuffer = null;
  this.program = null;

  this.attLocation = [];
  this.attStride = [];
  this.uniLocation = {};

  this.pMatrix = mat4.identity(mat4.create());
  this.vMatrix = mat4.identity(mat4.create());
  this.vpMatrix = mat4.identity(mat4.create());

  mat4.lookAt(this.vMatrix,[0.0, 0.0, 0.5], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  mat4.ortho(this.pMatrix,-1.0, 1.0, 1.0, -1.0, 0.1, 1);
  mat4.multiply(this.vpMatrix,this.pMatrix ,this.vMatrix);
}
PostProcessEffect.prototype = {

  init: function (width, height) {
    width = 256;
    height = 256;
    this.frameBuffer = this.createFrameBuffer(width, height);
    this.effect.position = [
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ];
    this.effect.texCoord = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      1.0, 1.0
    ];
    this.effect.index = [
      0, 2, 1,
      2, 3, 1
    ];
  },

  setUniformLocation: function(uniLocation,programObject,propertyArray){
    for(var i = 0,l = propertyArray.length; i<l; i++){
      uniLocation[propertyArray[i]] = this.gl.getUniformLocation(programObject, propertyArray[i]);
    }
  },

  setProgram: function (program) {
    this.program = program;
    this.attLocation[0] = this.gl.getAttribLocation(program, 'position');
    this.attLocation[1] = this.gl.getAttribLocation(program, 'texCoord');
    this.attStride[0] = 3;
    this.attStride[1] = 2;
    this.setUniformLocation(this.uniLocation, program, ['mvpMatrix','texture']);
    console.log(this.uniLocation)
  },

  createFrameBuffer: function (width, height) {
    // フレームバッファの生成
    var frameBuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, frameBuffer);

    // フレームバッファ用テクスチャの生成
    var fTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, fTexture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    // 深度バッファ用レンダーバッファの生成とバインド
    var depthRenderBuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthRenderBuffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);

    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, fTexture, 0);
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depthRenderBuffer);

    // 各種オブジェクトのバインドを解除
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

    // オブジェクトを返して終了
    return {f: frameBuffer, d: depthRenderBuffer, t: fTexture};

  },
};
