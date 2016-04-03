Cockpit = function (gl) {
  this.gl = gl;
  this.modelData = window.sphere(20, 20, .3);
  this.mMatrix = mat4.identity(mat4.create());
  this.invMatrix = mat4.identity(mat4.create());
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  this.scaleZ = 1;
  this.count = 0;
  this.speed = .02;
  this.isObjData = false;
  this.isLightEnable = true;
  this.isBump = false;
  this.textureObject = {};
  this.textureObject.diffuse = null;

  var diffuseMapSource = ImageLoader.images["images/beans.jpg"];
  console.log(ImageLoader.images)
  this.initTexture(diffuseMapSource, "diffuse");
  this.texture = this.textureObject.diffuse;

};
Cockpit.prototype = {
  initTexture: function (img, type) {
    // テクスチャオブジェクトの生成
    this.textureObject[type] = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureObject[type]);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  },
  render: function () {
    var translatePosition = [this.x, this.y, this.z];
    mat4.identity(this.mMatrix);
    mat4.translate(this.mMatrix, this.mMatrix, translatePosition);
    var scale = Math.random() * 10;
    this.scaleX = this.scaleY = this.scaleZ = scale;
    mat4.scale(this.mMatrix, this.mMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
    var radians = (this.count * 50 % 360) * Math.PI / 180;
    var axis = [1.0, 0.5, 0.1];
    mat4.rotate(this.mMatrix, this.mMatrix, radians, axis);
    mat4.invert(this.invMatrix, this.mMatrix);
  }
};
