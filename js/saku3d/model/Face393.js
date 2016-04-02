Face393 = function (gl, scene3D, lookTarget) {
    this.gl = gl;
    this.scene3D = scene3D;
    this.lookTarget = lookTarget;
    this.modelData = window.face393ModelData;

    this.mMatrix = mat4.identity(mat4.create());
    this.invMatrix = mat4.identity(mat4.create());

    this.qtn = quat.identity(quat.create());
    this.qMatrix = mat4.identity(mat4.create());

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationY = 0;
    this.scaleX = 3;
    this.scaleY = 3;
    this.scaleZ = 3;
    this.count = 0;
    this.rnd = Math.random() * 5 + 8;
    this.rnd1 = Math.random() * 5 + 8;
    this.rnd2 = Math.random() * 5 + 8;
    this.speed = Math.random() * 2;

    this.defaultPosture = [0, 0, 1];

    this.speedRatio = {}, this.ratio = {};
    this.speedRatio.x = Math.random() * 30 + 50;
    this.speedRatio.y = Math.random() * 30 + 50;
    this.speedRatio.z = Math.random() * 30 + 50;
    this.ratio.x = 0;
    this.ratio.y = 0;
    this.ratio.z = 0;

    this.beamLength = 20;
    this.beamArray = [];
    this.curentBeamIndex = 0;
    this.currentBeam = null;
    this.isLightEnable = true;
    this.isObjData = true;
    this.alpha = 1.0;

    for (var i = 0; i < this.beamLength; i++) {
        this.beamArray[i] = new Beans(this.gl, this.scene3D, this, this.lookTarget, ImageLoader.images["beans"]);
    }
}

Face393.prototype = {
    shoot: function () {
        this.curentBeamIndex++;
        if (this.curentBeamIndex >= this.beamLength) {
            this.curentBeamIndex = 0;
        }
        this.currentBeam = this.beamArray[this.curentBeamIndex];
        this.currentBeam.init();
        this.scene3D.addChild(this.beamArray[this.curentBeamIndex])
    },
    render: function () {
        this.count += this.speed

        var translatePosition = [this.x, this.y, this.z];
        mat4.identity(this.mMatrix);
        mat4.translate(this.mMatrix, this.mMatrix, translatePosition);
        mat4.scale(this.mMatrix, this.mMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
        var targetPosition = {x: 1, y: 0, z: 0};
        if (this.lookTarget) {
            targetPosition.x = this.lookTarget.x;
            targetPosition.y = this.lookTarget.y;
            targetPosition.z = this.lookTarget.z;
        }
        //
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

        mat4.invert(this.invMatrix, this.mMatrix);
    }
}