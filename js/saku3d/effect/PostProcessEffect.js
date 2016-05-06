PostProcessEffect = function (gl, shaderData, canvasWidth, canvasHeight) {
  //gl context
  this.gl = gl;
  this.shaderData = shaderData

  this.effect = {};
  this.frameBuffer = null;
  this.program = {};

  this.attLocation = [];
  this.attStride = [];
  this.uniLocation = {};

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
  this.pMatrix = mat4.identity(mat4.create());
  this.vMatrix = mat4.identity(mat4.create());
  this.vpMatrix = mat4.identity(mat4.create());

  mat4.lookAt(this.vMatrix, [0.0, 0.0, 0.5], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);
  mat4.ortho(this.pMatrix, -1.0, 1.0, 1.0, -1.0, 0.1, 1);
  mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);

  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;

  this.frameBuffer = this.createFrameBuffer(canvasWidth, canvasHeight);
  this.createProgram();
  this.setCurrentProgram('blur');
}
PostProcessEffect.prototype = {

  setCurrentProgram: function (key) {
    if(! this.program[key]) alert('undefined program key')
    var program = this.program[key];
    switch(key){
      case 'gray':
      {
        this.attLocation[0] = this.gl.getAttribLocation(program, 'position');
        this.attLocation[1] = this.gl.getAttribLocation(program, 'texCoord');
        this.attStride[0] = 3;
        this.attStride[1] = 2;
        this.setUniformLocation(program, ['mvpMatrix', 'texture']);
        break
      }
      case 'blur':
      {
        this.attLocation[0] = this.gl.getAttribLocation(program, 'position');
        this.attLocation[1] = this.gl.getAttribLocation(program, 'texCoord');
        this.attStride[0] = 3;
        this.attStride[1] = 2;
        this.weight = this.getWeight();
        this.setUniformLocation(program, ['mvpMatrix', 'texture','weight','horizonRatio','verticalRatio']);
        break
      }
    }
    this.program.current = program;
  },

  getWeight: function(){
    var weight = new Array(10);
    var t = 0.0;
    var eRange = 1000.0;
    var d = eRange * eRange / 1;
    for(var i = 0; i < weight.length; i++){
      var r = 1.0 + 2.0 * i;
      var w = Math.exp(-0.5 * (r * r) / d);
      weight[i] = w;
      if(i > 0){w *= 2.0;}
      t += w;
    }
    for(i = 0; i < weight.length; i++){
      weight[i] /= t;
    }
    return weight;
  },

  updateTextureSize: function (width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.frameBuffer = this.createFrameBuffer(width, height);
  },

  setUniformLocation: function (program, propertyArray) {
    this.uniLocation = {};
    for (var i = 0, l = propertyArray.length; i < l; i++) {
      this.uniLocation[propertyArray[i]] = this.gl.getUniformLocation(program, propertyArray[i]);
    }
  },

  createProgram: function () {
    if (this.shaderData.blur) {
      var vertexBlurSource = this.shaderData.blur.vertex;
      var fragmentBlurSource = this.shaderData.blur.fragment;
      this.program.blur = ShaderUtil.createShaderProgram(this.gl, vertexBlurSource, fragmentBlurSource);
    }
    if (this.shaderData.gray) {
      var vertexGraySource = this.shaderData.gray.vertex;
      var fragmentGraySource = this.shaderData.gray.fragment;
      this.program.gray = ShaderUtil.createShaderProgram(this.gl, vertexGraySource, fragmentGraySource);
    }
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
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

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
