Renderer = function (gl, scene, shaderData) {
  //gl context
  this.gl = gl;
  this.scene = scene;
  this.shaderData = shaderData;

  //program object
  this.programs = null;
  this.programs_points = null;
  this.programs_random = null;
  this.programs_blur = null;

  //uniform location
  this.uniLocation = {};
  this.uniLocation_points = {};
  this.uniLocation_random = {};

  //attribute location
  this.attLocation = [];
  this.attLocation_instancedArray = [];
  this.attLocation_points = [];

  //attribute stride
  this.attStride = [];
  this.attStride_instancedArray = [];

  this.postProcess = null;

  this.PROGRAM_INDEX = {
    BASIC: 0,
    POINT: 1,
    RANDOM: 2,
  };

  this.mMatrix = mat4.identity(mat4.create());
  this.mvpMatrix = mat4.identity(mat4.create());

  this.initWebgl();

}
Renderer.prototype = {

  setPostProcess: function(postProcess){
    this.postProcess = postProcess;
    this.postProcess.setProgram(this.programs_gray)
  },

  setCurrentProgramObject:function(programIndex){
    switch(programIndex){
      case this.PROGRAM_INDEX.BASIC:{
        this.gl.useProgram(this.programs);
        this.currentUniLocation = this.uniLocation;
        break;
      }
      case this.PROGRAM_INDEX.POINT:{
        this.gl.useProgram(this.programs_points);
        this.currentUniLocation = this.uniLocation_points;
        break;
      }
      case this.PROGRAM_INDEX.RANDOM:{
        this.gl.useProgram(this.programs_random);
        this.currentUniLocation = this.uniLocation_random;
        break;
      }
    }
  },

  renderPoint: function(mesh){
    mesh.mesh.render();
    mat4.multiply(this.mvpMatrix, this.scene.camera.vpMatrix, mesh.mesh.mMatrix);
    this.setAttribute(mesh.vertexBufferList, this.attLocation_points, this.attStride, null);

    if (mesh.mesh.textureObject.diffuse){
      this.gl.bindTexture(this.gl.TEXTURE_2D, mesh.mesh.texture);
      this.gl.uniform1i(this.currentUniLocation.texture, 0);
    }
    this.gl.uniformMatrix4fv(this.currentUniLocation.mvpMatrix, false, this.mvpMatrix);

    this.gl.drawArrays(this.gl.POINTS, 0, mesh.mesh.modelData.p.length / 3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    this.removeAttribute(this.attLocation_points);
  },

  renderMesh: function(mesh){
    mesh.mesh.render();
    mat4.multiply(this.mvpMatrix, this.scene.camera.vpMatrix, mesh.mesh.mMatrix);

    this.setAttribute(mesh.vertexBufferList, this.attLocation, this.attStride, mesh.indexBuffer);
    if(mesh.mesh.isInstancedArray){
      this.setAttribute_instancedArray(mesh.meshVboList_InstancedArray, this.attLocation_instancedArray, this.attStride_instancedArray)
    }

    if (mesh.mesh.textureObject.diffuse) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, mesh.mesh.textureObject.diffuse);
    }

    this.gl.uniform3fv(this.currentUniLocation.cameraPosition, this.scene.camera.cameraPosition);
    this.gl.uniform1f(this.currentUniLocation.alpha, mesh.mesh.alpha);
    this.gl.uniform1f(this.currentUniLocation.diffuseIntensity, mesh.mesh.diffuseIntensity);
    this.gl.uniform1f(this.currentUniLocation.specularIntensity, mesh.mesh.specularIntensity);
    this.gl.uniform1f(this.currentUniLocation.time, mesh.mesh.time);
    this.gl.uniform1f(this.currentUniLocation.randomSeeed, mesh.mesh.randomSeeed);
    this.gl.uniform1i(this.currentUniLocation.specularIndex, mesh.mesh.specularIndex);
    this.gl.uniform1i(this.currentUniLocation.isLightEnable, mesh.mesh.isLightEnable);
    this.gl.uniform1i(this.currentUniLocation.isTexture, mesh.mesh.isTexture);
    this.gl.uniform1i(this.currentUniLocation.isFlatShade, mesh.mesh.isFlatShade);
    this.gl.uniform1i(this.currentUniLocation.isInstancedArray, mesh.mesh.isInstancedArray);

    //RANDOM専用のuniform
    if(mesh.mesh.programIndex == this.PROGRAM_INDEX.RANDOM){
      var spikeRatio = mesh.mesh.spikeRatio || 1;
      this.gl.uniform1f(this.currentUniLocation.spikeRatio, spikeRatio);
      var detailRatio = mesh.mesh.detailRatio || 1;
      this.gl.uniform1f(this.currentUniLocation.detailRatio, detailRatio);
      var gainRatio = mesh.mesh.gainRatio || 1;
      this.gl.uniform1f(this.currentUniLocation.gainRatio, gainRatio);
      var timeRatio = mesh.mesh.timeRatio || 1;
      this.gl.uniform1f(this.currentUniLocation.timeRatio, timeRatio);
    }

    this.gl.uniformMatrix4fv(this.currentUniLocation.mMatrix, false, mesh.mesh.mMatrix);
    this.gl.uniformMatrix4fv(this.currentUniLocation.mvpMatrix, false, this.mvpMatrix);
    if (mesh.mesh.isLightEnable) {
      this.gl.uniform3fv(this.currentUniLocation.lookPoint, this.scene.camera.lookPoint);
      this.gl.uniformMatrix4fv(this.currentUniLocation.invMatrix, false, mesh.mesh.invMatrix);
      this.gl.uniform3fv(this.currentUniLocation.lightDirection, this.scene.light.lightDirection);
    }

    //カリング(描画しない)
    if (mesh.mesh.cullingIndex == 1){
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.BACK);
    }else if(mesh.mesh.cullingIndex == 2){
      this.gl.enable(this.gl.CULL_FACE);
      this.gl.cullFace(this.gl.FRONT);
    }

    // Angle Instanced Array
    if(mesh.mesh.isInstancedArray){
      this.extension.angleInstancedArrays.drawElementsInstancedANGLE(this.gl.TRIANGLES, mesh.mesh.modelData.i.length
        , this.gl.UNSIGNED_SHORT, 0, mesh.mesh.instanceLength );
    }
    else{
      this.gl.drawElements(this.gl.TRIANGLES, mesh.mesh.modelData.i.length, this.gl.UNSIGNED_SHORT, 0);
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);

    if (mesh.mesh.cullingIndex != 0){
      this.gl.disable(this.gl.CULL_FACE);
    }
    this.removeAttribute(this.attLocation);
  },

  renderEffect: function() {
    this.gl.useProgram(this.scene.postProcessObj.postProcess.program.current);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.uniformMatrix4fv(this.scene.postProcessObj.postProcess.uniLocation.mvpMatrix, false, this.scene.postProcessObj.postProcess.vpMatrix);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.uniform1i(this.scene.postProcessObj.postProcess.uniLocation.texture, 0);
    if(this.scene.postProcessObj.postProcess.canvasWidth){
      this.gl.uniform1f(this.scene.postProcessObj.postProcess.uniLocation.horizonRatio, this.scene.postProcessObj.postProcess.canvasWidth);
    }
    if(this.scene.postProcessObj.postProcess.canvasHeight){
      this.gl.uniform1f(this.scene.postProcessObj.postProcess.uniLocation.verticalRatio, this.scene.postProcessObj.postProcess.canvasHeight);
    }
    if(this.scene.postProcessObj.postProcess.weight){
      this.gl.uniform1fv(this.scene.postProcessObj.postProcess.uniLocation.weight, this.scene.postProcessObj.postProcess.weight);
    }
    this.setAttribute(this.scene.postProcessObj.vertexBufferList,
      this.scene.postProcessObj.postProcess.attLocation,
      this.scene.postProcessObj.postProcess.attStride,
      this.scene.postProcessObj.indexBuffer
    );
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.scene.postProcessObj.postProcess.frameBuffer.t);
    this.gl.drawElements(this.gl.TRIANGLES, this.scene.postProcessObj.postProcess.effect.index.length, this.gl.UNSIGNED_SHORT, 0);
    this.gl.bindTexture(this.gl.TEXTURE_2D,null);
    //
    this.removeAttribute(this.scene.postProcessObj.postProcess.attLocation);
  },

  render: function () {
    //postProcess判定
    if(this.scene.postProcessObj){
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.scene.postProcessObj.postProcess.frameBuffer.f);
    }
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //カメラに座標変換行列の更新
    this.scene.camera.render();

    //各3Dオブジェクトの描画処理
    for (var i = 0, l = this.scene.meshList.length; i < l; i++) {

      if (!this.scene.meshList[i]) return;
      //programObjectの設定
      this.setCurrentProgramObject(this.scene.meshList[i].mesh.programIndex);

      if (this.scene.meshList[i].mesh.isPoint) {
        this.renderPoint(this.scene.meshList[i]);
      }
      else {
        this.renderMesh(this.scene.meshList[i]);
      }

    }
    //postProcess判定
    if(this.scene.postProcessObj){
      this.renderEffect();
    }
    this.gl.flush();
  },

  initExtension:function(){
    this.extension = {};
    //Flat shading
    if (!this.gl.getExtension('OES_standard_derivatives')) {
      console.log('OES_standard_derivatives is not supported');
      return;
    }
    this.extension.angleInstancedArrays = this.gl.getExtension('ANGLE_instanced_arrays');
    if (!this.extension.angleInstancedArrays) {
      console.log('ANGLE_instanced_arrays is no supported');
      return;
    }
  },

  createProgram: function(){
    if(this.shaderData.basic) {
      var vertexShaderSource = this.shaderData.basic.vertex;
      var fragmentShaderSource = this.shaderData.basic.fragment;
      this.programs = ShaderUtil.createShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
    }
    if(this.shaderData.point) {
      var vertexShaderPointsSource = this.shaderData.point.vertex;
      var fragmentShaderPointsSource = this.shaderData.point.fragment;
      this.programs_points = ShaderUtil.createShaderProgram(this.gl, vertexShaderPointsSource, fragmentShaderPointsSource);
    }
    if(this.shaderData.random){
      var vertexShaderRandomSource = this.shaderData.random.vertex;
      var fragmentShaderRandomSource = this.shaderData.random.fragment;
      this.programs_random = ShaderUtil.createShaderProgram(this.gl, vertexShaderRandomSource, fragmentShaderRandomSource);
    }
  },

  initWebgl: function () {

    this.initExtension();

    //基本背景色の定義
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //深度テストの定義
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    //アルファブレンディングの有効化
    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD,this.gl.ONE);
    this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE);

    //色と深度の初期化
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //シェーダー/プログラムの生成
    this.createProgram();

    //uniformのindexの取得
    var uniformPropertyArray = [
      "texture",
      "mMatrix",
      "mvpMatrix",
      "invMatrix",
      "lightDirection",
      "cameraPosition",
      "lookPoint",
      "ambientColor",
      "alpha",
      "mMatrix",
      "isLightEnable",
      "isFlatShade",
      "isTexture",
      "isInstancedArray",
      "specularIndex",
      "diffuseIntensity",
      "specularIntensity",
      "time",
      "randomSeed",
    ];
    var uniformPropertyForRandomArray = [
      "spikeRatio",
      "detailRatio",
      "gainRatio",
      "timeRatio",
    ];
    this.setUniformLocation(this.uniLocation, this.programs, uniformPropertyArray);
    this.setUniformLocation(this.uniLocation_random, this.programs_random, uniformPropertyArray.concat(uniformPropertyForRandomArray));

    var uniformPointsPropertyArray = [
      "texture",
      "isTexture",
      "mvpMatrix",
    ]
    this.setUniformLocation(this.uniLocation_points, this.programs_points, uniformPointsPropertyArray);

    // attributeLocationを取得して配列に格納する
    this.attLocation[0] = this.gl.getAttribLocation(this.programs, 'position');
    this.attLocation[1] = this.gl.getAttribLocation(this.programs, 'normal');
    this.attLocation[2] = this.gl.getAttribLocation(this.programs, 'texCoord');
    this.attLocation[3] = this.gl.getAttribLocation(this.programs, 'color');

    this.attLocation_points[0] = this.gl.getAttribLocation(this.programs_points, 'position');

    // attributeのストライドを配列に格納しておく
    this.attStride[0] = 3;
    this.attStride[1] = 3;
    this.attStride[2] = 2;
    this.attStride[3] = 4;

    //Angle instanced Array用
    this.attLocation_instancedArray[0] = this.gl.getAttribLocation(this.programs, 'instancedArrayPosition');
    this.attLocation_instancedArray[1] = this.gl.getAttribLocation(this.programs, 'instancedArrayRandomSeed');
    this.attStride_instancedArray[0] = 3;
    this.attStride_instancedArray[1] = 1;

    //モデルに左右しない固定情報を先に転送する
    this.gl.useProgram(this.programs);
    this.gl.uniform3fv(this.uniLocation.lightDirection, this.scene.light.lightDirection);
    this.gl.uniform3fv(this.uniLocation.ambientColor, this.scene.light.ambientColor);

    this.gl.useProgram(this.programs_random);
    this.gl.uniform3fv(this.uniLocation_random.lightDirection, this.scene.light.lightDirection);
    this.gl.uniform3fv(this.uniLocation_random.ambientColor, this.scene.light.ambientColor);
  },

  setUniformLocation: function(uniLocation,programObject,propertyArray){
    for(var i = 0,l = propertyArray.length; i<l; i++){
      uniLocation[propertyArray[i]] = this.gl.getUniformLocation(programObject, propertyArray[i]);
    }
  },

  setAttribute: function (vbo, attL, attS, ibo) {
    for (var i in vbo) {
      if (vbo[i] && attL[i] != undefined) {
        //instanced Array の場合
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
        this.gl.enableVertexAttribArray(attL[i]);
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
      }
    }
    if (ibo) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    }
  },
  setAttribute_instancedArray: function (vbo, attL, attS) {
    for (var i in vbo) {
      if (vbo[i] && attL[i] != undefined) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
        this.gl.enableVertexAttribArray(attL[i]);
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
        this.extension.angleInstancedArrays.vertexAttribDivisorANGLE(attL[i], 1);
      }
    }
  },
  removeAttribute: function(attL){
    var l = attL.length;;
    for (var j = 0; j < l; j++) {
      this.gl.disableVertexAttribArray(attL[j]);
    }
  },
};
