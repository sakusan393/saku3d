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
    this.fov = 25 * Math.PI / 180;                           // 視野角
    this.aspect = canvas.width / canvas.height; // アスペクト比
    this.near = 0.1;                            // 空間の最前面
    this.far = 200.0;                            // 空間の奥行き終端
    mat4.perspective(this.pMatrix, this.fov, this.aspect, this.near, this.far);
    mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
    this.count = 0;
    this.lookTarget = null
};
Camera.prototype = {
    setTarget: function (cameraTarget) {
        this.lookTarget = cameraTarget
    },
    render: function () {

        if (this.lookTarget) {
            this.lookPoint = [this.lookTarget.x, this.lookTarget.y, this.lookTarget.z]
        }
        this.cameraPosition = [this.x, this.y, this.z];

        mat4.lookAt(this.vMatrix, this.cameraPosition, this.lookPoint, this.cameraUp);
        mat4.perspective(this.pMatrix, this.fov, this.aspect, this.near, this.far);
        mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
    }
};