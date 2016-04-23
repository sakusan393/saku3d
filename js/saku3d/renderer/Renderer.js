Renderer = function (gl, scene, shaderData) {
  //gl context
  this.gl = gl;
  this.scene = scene;
  this.shaderData = shaderData;

  //program object
  this.programs = null;
  this.programs_points = null;

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

  this.PROGRAM_INDEX = {
    BASIC: 0,
    POINT: 1,
    RANDOM: 2,
  }

  this.mMatrix = mat4.identity(mat4.create());
  this.mvpMatrix = mat4.identity(mat4.create());

  this.initWebgl();

}
Renderer.prototype = {

  setProgramObject:function(programIndex){
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

    this.gl.uniformMatrix4fv(this.currentUniLocation.mvpMatrix, false, this.mvpMatrix);
    //明示的に0番目を指定
    this.gl.uniform1i(this.currentUniLocation.texture, 0);
    if (mesh.mesh.texture) this.gl.bindTexture(this.gl.TEXTURE_2D, mesh.mesh.texture);
    this.gl.drawArrays(this.gl.POINTS, 0, mesh.mesh.modelData.p.length / 3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  },

  renderMesh: function(mesh){
    mesh.mesh.render();
    mat4.multiply(this.mvpMatrix, this.scene.camera.vpMatrix, mesh.mesh.mMatrix);

    this.setAttribute(mesh.vertexBufferList, this.attLocation, this.attStride, mesh.indexBuffer);
    if(mesh.mesh.isInstancedArray){
      this.setAttribute_instancedArray(mesh.meshVboList_InstancedArray, this.attLocation_instancedArray, this.attStride_instancedArray)
    }

    //明示的に0番目を指定
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
  },

  render: function () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    //カメラに座標変換行列の更新
    this.scene.camera.render();

    //各3Dオブジェクトの描画処理
    for (var i = 0, l = this.scene.meshList.length; i < l; i++) {

      if (!this.scene.meshList[i]) return;

      //programObjectの設定
      this.setProgramObject(this.scene.meshList[i].mesh.programIndex);

      if (this.scene.meshList[i].mesh.isPoint) {
        this.renderPoint(this.scene.meshList[i]);
      }
      else {
        this.renderMesh(this.scene.meshList[i]);
      }
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

    //シェーダーの生成
    var vertexShaderSource = this.shaderData.basic.vertex;
    var fragmentShaderSource = this.shaderData.basic.fragment;
    var vertexShaderPointsSource = this.shaderData.point.vertex;
    var fragmentShaderPointsSource = this.shaderData.point.fragment;
    var vertexShaderRandomSource = this.shaderData.random.vertex;
    var fragmentShaderRandomSource = this.shaderData.random.fragment;

    //プログラムの生成
    this.programs = this.createShaderProgram(vertexShaderSource, fragmentShaderSource);
    this.programs_points = this.createShaderProgram(vertexShaderPointsSource, fragmentShaderPointsSource);
    this.programs_random = this.createShaderProgram(vertexShaderRandomSource, fragmentShaderRandomSource);

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
    console.log(this.attLocation_points[0]);


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

  createShaderProgram: function (vertexShaderSource, fragmentShaderSource) {
    //shaderオブジェクトを生成
    var vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    var fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    //shaderオブジェクトにソースを割り当てて、コンパイル
    this.gl.shaderSource(vertexShader, vertexShaderSource);
    this.gl.compileShader(vertexShader);
    this.checkShaderCompile(vertexShader)
    this.gl.shaderSource(fragmentShader, fragmentShaderSource);
    this.gl.compileShader(fragmentShader);
    this.checkShaderCompile(fragmentShader)

    //programを生成し、shaderとの紐づけ
    var programs = this.gl.createProgram();
    this.gl.attachShader(programs, vertexShader);
    this.gl.attachShader(programs, fragmentShader);
    this.gl.linkProgram(programs);
    this.checkLinkPrograms(programs)

    return programs;
  },

  setAttribute: function (vbo, attL, attS, ibo) {
    var l = attL.length
    for (var j = 0; j < l; j++) {
      this.gl.disableVertexAttribArray(attL[j]);
    }
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
    var l = attL.length
    for (var j = 0; j < l; j++) {
      this.gl.disableVertexAttribArray(attL[j]);
    }
    for (var i in vbo) {
      if (vbo[i]) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
        this.gl.enableVertexAttribArray(attL[i]);
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
        this.extension.angleInstancedArrays.vertexAttribDivisorANGLE(attL[i], 1);
      }
    }
  },

  checkShaderCompile: function (shader) {
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.log(this.gl.getShaderInfoLog(shader))
    }
  },

  checkLinkPrograms: function (program) {
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.log(this.gl.getProgramInfoLog(program))
    } else {
      //this.gl.useProgram(program);
    }
  }
};
