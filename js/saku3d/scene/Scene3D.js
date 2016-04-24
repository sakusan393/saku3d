Scene3D = function (gl, camera, light) {
  this.gl = gl;
  this.camera = camera;
  this.light = light;
  this.meshList = [];
  this.postProcessObj = null;
  this.count = 0;
}
Scene3D.prototype = {

  addChild: function (mesh) {
    var meshIndexBuffer;
    var meshVboList = [];
    var meshVboList_InstancedArray = [];
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
    if (mesh.modelData.i) {
      meshIndexBuffer = this.generateIBO(mesh.modelData.i);
    }
    //Angle instanced Array
    if (mesh.isInstancedArray) {
      if(mesh.instancedArrayPosition){
        meshVboList_InstancedArray[0] = this.generateVBO(mesh.instancedArrayPosition);
      }
      if(mesh.instancedArrayRandomSeed){
        meshVboList_InstancedArray[1] = this.generateVBO(mesh.instancedArrayRandomSeed);
      }
    }
    var obj = {"vertexBufferList": meshVboList,"meshVboList_InstancedArray": meshVboList_InstancedArray, "indexBuffer": meshIndexBuffer, "mesh": mesh};
    mesh.index = this.meshList.length;
    this.meshList.push(obj);
  },

  addPostProcess: function (postProcess) {
    var postProcessIndexBuffer;
    var postProcessVboList = [];
    if (postProcess.effect.position) {
      postProcessVboList[0] = this.generateVBO(postProcess.effect.position);
    }
    if (postProcess.effect.texCoord) {
      postProcessVboList[1] = this.generateVBO(postProcess.effect.texCoord);
    }
    if (postProcess.effect.index) {
      postProcessIndexBuffer = this.generateIBO(postProcess.effect.index);
    }
    this.postProcessObj = {"vertexBufferList": postProcessVboList, "indexBuffer": postProcessIndexBuffer, "postProcess": postProcess};
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
