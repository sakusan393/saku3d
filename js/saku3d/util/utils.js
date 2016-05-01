/**
 * Created by 393 on 2016/03/14.
 */
var inherits = function (childCtor, parentCtor) {
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
};

if (window.requestAnimationFrame === undefined || window.cancelAnimationFrame === undefined) {
  requestAnimationFrame = function (callback) {
    var currTime = Date.now(), timeToCall = Math.max(0, 16 - ( currTime - lastTime ));
    var id = self.setTimeout(function () {
      callback(currTime + timeToCall);

    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}


var CLOCK = {
  start: Date.now(),
  prevTime: 0,
  getElapsedTime: function(){
    this.prevTime = Date.now();
    return this.prevTime - this.start;
  },
  getDelta: function(){
    return Date.now() - this.prevTime;
  }
};

var ShaderUtil = {

  createShaderProgram: function (gl, vertexShaderSource, fragmentShaderSource) {
    //shaderオブジェクトを生成
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //shaderオブジェクトにソースを割り当てて、コンパイル
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    ShaderUtil.checkShaderCompile(gl, vertexShader);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    ShaderUtil.checkShaderCompile(gl, fragmentShader);

    //programを生成し、shaderとの紐づけ
    var programs = gl.createProgram();
    gl.attachShader(programs, vertexShader);
    gl.attachShader(programs, fragmentShader);
    gl.linkProgram(programs);
    ShaderUtil.checkLinkPrograms(gl, programs);

    return programs;
  },
  checkShaderCompile: function (gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader))
    }
  },

  checkLinkPrograms: function (gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(program))
    }
  }
}
