AbstractModel = function (gl, scene3D, initObject) {
  this.gl = gl;
  this.scene3D = scene3D;
  this.isLookAt = false;
  this.isPoint = false;
  this.lookTarget = null;
  this.PI = Math.PI;

  if (initObject) {
    this.lookTarget = initObject.lookTarget;
    this.modelData = initObject.modelData;
    if (this.lookTarget) this.isLookAt = true;
  }

  this.mMatrix = mat4.identity(mat4.create());
  this.invMatrix = mat4.identity(mat4.create());

  this.qtn = quat.identity(quat.create());
  this.qMatrix = mat4.identity(mat4.create());

  this.x = 0;
  this.y = 0;
  this.z = 0;

  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;

  this.scaleX = 1;
  this.scaleY = 1;
  this.scaleZ = 1;

  this.defaultPosture = [0, 0, 1];

  this.initialize(initObject);
}

AbstractModel.prototype = {
  initialize: function () {
    //拡張用
    console.log("拡張用function")
  },
  initTexture: function (img, type) {
    // テクスチャオブジェクトの生成
    this.textureObject[type] = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObject[type]);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  },
  setScale: function (value) {
    this.scaleX = this.scaleY = this.scaleZ = value;
  },
  render: function () {
    var translatePosition = [this.x, this.y, this.z];
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, this.mMatrix, translatePosition);
    mat4.scale(this.mMatrix, this.mMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
    var targetPosition = {x: 1, y: 0, z: 0};
    if (this.isLookAt) {
      targetPosition.x = this.lookTarget.x;
      targetPosition.y = this.lookTarget.y;
      targetPosition.z = this.lookTarget.z;
      //クォータニオンによる姿勢制御
      var lookVector = vec3.subtract([], [targetPosition.x, targetPosition.y, targetPosition.z], [this.x, this.y, this.z])
      //回転軸(外積)
      var rotationAxis = vec3.cross([], lookVector, this.defaultPosture);
      vec3.normalize(rotationAxis, rotationAxis);

      //なす角(radian)
      var qAngle = Math.acos(vec3.dot(lookVector, this.defaultPosture) / (vec3.length(lookVector) * vec3.length(this.defaultPosture)))
      quat.setAxisAngle(this.qtn, rotationAxis, -qAngle);
      mat4.identity(this.qMatrix);
      mat4.fromQuat(this.qMatrix, this.qtn);
      mat4.multiply(this.mMatrix, this.mMatrix, this.qMatrix);
    } else {
      var radX = this.rotationX * this.PI / 180;
      var radY = this.rotationY * this.PI / 180;
      var radZ = this.rotationZ * this.PI / 180;
      var axisX = [1.0, 0.0, 0.0];
      var axisY = [0.0, 1.0, 0.0];
      var axisZ = [0.0, 0.0, 1.0];
      mat4.rotate(this.mMatrix, this.mMatrix, radY, axisY);
      mat4.rotate(this.mMatrix, this.mMatrix, radX, axisX);
      mat4.rotate(this.mMatrix, this.mMatrix, radZ, axisZ);
    }
    mat4.invert(this.invMatrix, this.mMatrix);
  }
}
