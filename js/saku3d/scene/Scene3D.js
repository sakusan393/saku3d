Scene3D = function (gl, camera, light) {
  this.gl = gl;
  this.camera = camera;
  this.light = light;
  this.meshList = [];
  this.count = 0;
}
Scene3D.prototype = {

  addChild: function (mesh) {
    var meshIndexBuffer;
    var meshVboList = [];
    if (mesh.modelData.p) {
      meshVboList[0] = this.generateVBO(mesh.modelData.p);
    }
    if (mesh.modelData.n) {
      meshVboList[1] = this.generateVBO(mesh.modelData.n);
    }
    if (mesh.modelData.t) {
      meshVboList[2] = this.generateVBO(mesh.modelData.t);
    }
    if (mesh.modelData.c) {
      meshVboList[3] = this.generateVBO(mesh.modelData.c);
    }
    if (mesh.modelData.instancedArrayPosition) {
      meshVboList[4] = this.generateVBO(mesh.modelData.instancedArrayPosition);
      console.log("aa",meshVboList[4],mesh.modelData.instancedArrayPosition)
    }
    if (mesh.modelData.i) {
      meshIndexBuffer = this.generateIBO(mesh.modelData.i);
    }
    var obj = {"vertexBufferList": meshVboList, "indexBuffer": meshIndexBuffer, "mesh": mesh};
    mesh.index = this.meshList.length;
    this.meshList.push(obj);
  },
  removeChild: function (mesh) {
    var length = this.meshList.length;
    for (var i = 0; i < length; i++) {
      if (this.meshList[i] && this.meshList[i].mesh) {
        if (this.meshList[i].mesh.index == mesh.index) {
          this.meshList[i].vertexBufferList = null;
          this.meshList[i].indexBuffer = null;
          this.meshList[i].mesh = null;
          this.meshList.splice(i, 1);
          return
        }
      }
    }
  },

  generateVBO: function (data) {
    var vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    return vertexBuffer;
  },

  generateIBO: function (data) {
    var indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    return indexBuffer;
  }

};
