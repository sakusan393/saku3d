Earth = function (gl, scene3D, initObject) {
  //superクラスのコンストラクタを実行
  AbstractModel.call(this, gl, scene3D, initObject);

  this.initialize(initObject);
};

Earth.prototype = {
  initialize: function (initObject) {
    this.isLightEnable = true;
    this.alpha = 1.0;
    this.diffuseIntensity = 5.0;
    this.specularIndex = 1;
    this.programIndex = 2;
    this.isFlatShade = false;
    this.isTexture = true;
    if (initObject && initObject.specularIndex) this.specularIndex = initObject.specularIndex;
    this.textureObject = {};
    this.textureObject.diffuse = null;
    this.textureObject.bump = null;
    // var diffuseMapSource = ImageLoader.images["images/beans.jpg"];
    this.initTexture(initObject.textureCanvas, "diffuse");
  },
  setTexture: function(img){
    this.initTexture(img, "diffuse");
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
  render: function () {
    this.time = CLOCK.getElapsedTime() / 10000;
    var translatePosition = [this.x, this.y, this.z];
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, this.mMatrix, translatePosition);
    mat4.scale(this.mMatrix, this.mMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
    var targetPosition = {x: 1, y: 0, z: 0};
    var lookVector,rotationAxis,qAngle;

    if (this.isLookAt) {
      targetPosition.x = this.lookTarget.x;
      targetPosition.y = this.lookTarget.y;
      targetPosition.z = this.lookTarget.z;
      //クォータニオンによる姿勢制御
      lookVector = vec3.subtract([], [targetPosition.x, targetPosition.y, targetPosition.z], [this.x, this.y, this.z])
      //回転軸(外積)
      rotationAxis = vec3.cross([], lookVector, this.defaultPosture);
      vec3.normalize(rotationAxis, rotationAxis);

      //なす角(radian)
      qAngle = Math.acos(vec3.dot(lookVector, this.defaultPosture) / (vec3.length(lookVector) * vec3.length(this.defaultPosture)))
      quat.setAxisAngle(this.qtn, rotationAxis, -qAngle);
      mat4.identity(this.qMatrix);
      mat4.fromQuat(this.qMatrix, this.qtn);
      mat4.multiply(this.mMatrix, this.mMatrix, this.qMatrix);
    }
    else if(this.isMoveForward){
      targetPosition.x = this.x;
      targetPosition.y = this.y;
      targetPosition.z = this.z;
      //クォータニオンによる姿勢制御
      lookVector = vec3.subtract([], [targetPosition.x, targetPosition.y, targetPosition.z], [this.previousX, this.previousY, this.previousZ]);
      if(! vec3.length(lookVector)) return;

      //回転軸(外積)
      rotationAxis = vec3.cross([], lookVector, this.defaultPosture);
      vec3.normalize(rotationAxis, rotationAxis);
      //なす角(radian)
      qAngle = Math.acos(vec3.dot(lookVector, this.defaultPosture) / (vec3.length(lookVector) * vec3.length(this.defaultPosture)))
      quat.setAxisAngle(this.qtn, rotationAxis, -qAngle);
      mat4.identity(this.qMatrix);
      mat4.fromQuat(this.qMatrix, this.qtn);
      mat4.multiply(this.mMatrix, this.mMatrix, this.qMatrix);

    }else {
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

    this.previousX = this.x;
    this.previousY = this.y;
    this.previousZ = this.z;
  }
};

inherits(Earth,AbstractModel);

