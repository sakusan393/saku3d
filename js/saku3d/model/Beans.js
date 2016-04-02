Beans = function (gl, scene3D, parent, target, img) {
    this.gl = gl;
    this.scene3D = scene3D;
    this.lookTarget = parent;
    if(target != null) this.target = target;
    else this.target = {x:0,y:0,z:0};

    this.modelData = window.sphere(10, 10, .3, [1.0, 1.0, 0, 1.0]);
    this.qtn = quat.identity(quat.create());
    this.mMatrix = mat4.identity(mat4.create());
    this.qMatrix = mat4.identity(mat4.create());
    this.invMatrix = mat4.identity(mat4.create());
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;
    this.life = 50;
    this.startAlpha = 1.0;
    this.alpha = this.startAlpha;
    this.currentLife = this.life;
    this.speed = 1;
    this.index = 0;
    this.isLightEnable = true;
    this.isObjData = false;


    this.defaultPosture = [0, 0, 1];
    if (img) {
        this.initTexture(img)
    }
}

Beans.prototype = {
    initTexture: function (img) {
        this.useTexture = true;
        // テクスチャオブジェクトの生成
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        this.gl.generateMipmap(this.gl.TEXTURE_2D);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    },
    init: function () {
        this.x = this.lookTarget.x;
        this.y = this.lookTarget.y;
        this.z = this.lookTarget.z;
        this.alpha = this.startAlpha;
        this.currentLife = this.life;
        //クォータニオンによる姿勢制御
        this.lookVector = vec3.subtract([], [this.target.x, this.target.y, this.target.z], [this.x, this.y, this.z])
        //回転軸(外積)
        var rotationAxis = vec3.cross([], this.lookVector, this.defaultPosture);
        vec3.normalize(rotationAxis, rotationAxis);

        //なす角(radian)
        var qAngle = Math.acos(vec3.dot(this.lookVector, this.defaultPosture) / vec3.length(this.lookVector) * vec3.length(this.defaultPosture))
        quat.setAxisAngle(this.qtn, rotationAxis, -qAngle);
        mat4.identity(this.qMatrix);
        mat4.fromQuat(this.qMatrix, this.qtn);
    },
    render: function () {
        var percent = (this.currentLife / this.life > this.startAlpha / 4) ? this.startAlpha : this.currentLife / this.life;
        this.alpha = percent;
        vec3.normalize(this.lookVector, this.lookVector)
        this.x += this.lookVector[0] * this.speed;
        this.y += this.lookVector[1] * this.speed;
        this.z += this.lookVector[2] * this.speed;
        var translatePosition = [this.x, this.y, this.z];
        mat4.identity(this.mMatrix);
        mat4.translate(this.mMatrix, this.mMatrix, translatePosition);
        mat4.multiply(this.mMatrix, this.mMatrix, this.qMatrix);

        var scale = [this.scaleX, this.scaleY, this.scaleZ]
        mat4.scale(this.mMatrix, this.mMatrix, scale);

        this.currentLife--;
        if (this.currentLife <= 0) {
            requestAnimationFrame(this.dispose.bind(this))
        }
    },
    dispose: function () {
        this.scene3D.removeChild(this)
    }
}
