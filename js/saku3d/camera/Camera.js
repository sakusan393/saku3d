var Camera = function (canvas) {
  // ビュー座標変換行列
  this.lookPoint = [0.0, 0.0, 0.0];    // 注視点
  this.x = 0;
  this.y = 0;
  this.z = 5;
  this.cameraPosition = [this.x, this.y, this.z]; // カメラの位置
  this.cameraUp = [0.0, 1.0, 0.0];       // カメラの上方向
  this.vMatrix = mat4.identity(mat4.create());
  this.pMatrix = mat4.identity(mat4.create());
  this.vpMatrix = mat4.identity(mat4.create());
  mat4.lookAt(this.vMatrix, this.cameraPosition, this.lookPoint, this.cameraUp);

  // プロジェクションのための情報を揃える
  this.fov = 30 * Math.PI / 180;                           // 視野角
  this.aspect = canvas.width / canvas.height; // アスペクト比
  this.near = 0.1;                            // 空間の最前面
  this.far = 2000.0;                            // 空間の奥行き終端
  mat4.perspective(this.pMatrix, this.fov, this.aspect, this.near, this.far);
  mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
  this.count = 0;
  this.lookTarget = null
};
Camera.prototype = {
  setTarget: function (cameraTarget) {
    this.lookTarget = cameraTarget
  },
  setFov: function (radian) {
    this.fov = radian * Math.PI / 180;
  },
  render: function () {

    if (this.lookTarget) {
      var time = CLOCK.getElapsedTime() * 0.003;
      var offsetX = Math.sin(time * .2) * 5 * (Math.cos(time * .4) + 1);
      var offsetY = Math.cos(time * .6) * 5 * (Math.cos(time * .2) + 1);
      var offsetZ = Math.cos(time * .3) * 5 * (Math.sin(time * .3) + 1);
      this.lookPoint = [this.lookTarget.x - offsetX, this.lookTarget.y - offsetY, this.lookTarget.z - offsetZ]
    }
    this.cameraPosition = [this.x, this.y, this.z];

    mat4.lookAt(this.vMatrix, this.cameraPosition, this.lookPoint, this.cameraUp);
    mat4.perspective(this.pMatrix, this.fov, this.aspect, this.near, this.far);
    mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
  }
};
