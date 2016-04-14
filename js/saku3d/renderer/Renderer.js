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
  this.attLocation_points = [];

  //attribute stride
  this.attStride = [];

  this.mMatrix = mat4.identity(mat4.create());
  this.mvpMatrix = mat4.identity(mat4.create());

  this.initWebgl();

}
Renderer.prototype = {

  setProgramObject:function(programIndex){
    switch(programIndex){
      case 0:{
        this.gl.useProgram(this.programs);
        this.currentUniLocation = this.uniLocation;
        break;
      }
      case 1:{
        this.gl.useProgram(this.programs_points);
        this.currentUniLocation = this.uniLocation_points;
        break;
      }
      case 2:{
        this.gl.useProgram(this.programs_random);
        this.currentUniLocation = this.uniLocation_random;
        break;
      }
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

      //POINTの描画
      if (this.scene.meshList[i].mesh.isPoint) {
        this.setAttribute(this.scene.meshList[i].vertexBufferList, this.attLocation_points, this.attStride, null);
        this.scene.meshList[i].mesh.render();
        mat4.multiply(this.mvpMatrix, this.scene.camera.vpMatrix, this.scene.meshList[i].mesh.mMatrix);

        this.gl.uniformMatrix4fv(this.currentUniLocation.mvpMatrix, false, this.mvpMatrix);
        //明示的に0番目を指定
        //this.gl.uniform1i(this.currentUniLocation.texture, 0);
        if (this.scene.meshList[i].mesh.texture) this.gl.bindTexture(this.gl.TEXTURE_2D, this.scene.meshList[i].mesh.texture);
        this.gl.drawArrays(this.gl.POINTS, 0, this.scene.meshList[i].mesh.modelData.p.length / 3);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      }
      //MESHの描画
      else {
        // this.gl.useProgram(this.programs);
        this.gl.uniform3fv(this.currentUniLocation.eyePosition, this.scene.camera.cameraPosition);
        this.gl.uniform1f(this.currentUniLocation.alpha, this.scene.meshList[i].mesh.alpha);
        this.gl.uniform1f(this.currentUniLocation.diffuseIntensity, this.scene.meshList[i].mesh.diffuseIntensity);
        this.gl.uniform1f(this.currentUniLocation.specularIntensity, this.scene.meshList[i].mesh.specularIntensity);
        this.gl.uniform1f(this.currentUniLocation.time, this.scene.meshList[i].mesh.time);
        this.gl.uniform1i(this.currentUniLocation.specularIndex, this.scene.meshList[i].mesh.specularIndex);
        this.gl.uniform1i(this.currentUniLocation.isLightEnable, this.scene.meshList[i].mesh.isLightEnable);
        this.gl.uniform1i(this.currentUniLocation.isTexture, this.scene.meshList[i].mesh.isTexture);
        this.gl.uniform1i(this.currentUniLocation.isFlatShade, this.scene.meshList[i].mesh.isFlatShade);

        //裏面をカリング(描画しない)
        if (this.scene.meshList[i].mesh.cullingIndex == 1){
          this.gl.enable(this.gl.CULL_FACE);
          this.gl.cullFace(this.gl.BACK);
        }else if(this.scene.meshList[i].mesh.cullingIndex == 2){
          this.gl.enable(this.gl.CULL_FACE);
          this.gl.cullFace(this.gl.FRONT);
        }

        this.setAttribute(this.scene.meshList[i].vertexBufferList, this.attLocation, this.attStride, this.scene.meshList[i].indexBuffer);
        this.scene.meshList[i].mesh.render();

        mat4.multiply(this.mvpMatrix, this.scene.camera.vpMatrix, this.scene.meshList[i].mesh.mMatrix);

        this.gl.uniformMatrix4fv(this.currentUniLocation.mMatrix, false, this.scene.meshList[i].mesh.mMatrix);
        this.gl.uniformMatrix4fv(this.currentUniLocation.mvpMatrix, false, this.mvpMatrix);
        if (this.scene.meshList[i].mesh.isLightEnable) {
          this.gl.uniform3fv(this.currentUniLocation.lookPoint, this.scene.camera.lookPoint);

          this.gl.uniformMatrix4fv(this.currentUniLocation.invMatrix, false, this.scene.meshList[i].mesh.invMatrix);
          this.gl.uniform3fv(this.currentUniLocation.lightDirection, this.scene.light.lightDirection);
        }
        //明示的に0番目を指定
        if (this.scene.meshList[i].mesh.textureObject.diffuse) {
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.scene.meshList[i].mesh.textureObject.diffuse);
        }

        this.gl.drawElements(this.gl.TRIANGLES, this.scene.meshList[i].mesh.modelData.i.length, this.gl.UNSIGNED_SHORT, 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        if (this.scene.meshList[i].mesh.cullingIndex != 0){
          this.gl.disable(this.gl.CULL_FACE);
        }
      }
    }
    this.gl.flush();
  },

  initWebgl: function () {

    if (!this.gl.getExtension('OES_standard_derivatives')) {
      console.log('OES_standard_derivatives is not supported');
      return;
    }
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
      "eyePosition",
      "lookPoint",
      "ambientColor",
      "alpha",
      "mMatrix",
      "isLightEnable",
      "isFlatShade",
      "isTexture",
      "specularIndex",
      "diffuseIntensity",
      "specularIntensity",
      "time"
    ];
    this.setUniformLocation(this.uniLocation, this.programs, uniformPropertyArray);
    this.setUniformLocation(this.uniLocation_random, this.programs_random, uniformPropertyArray);

    var uniformPointsPropertyArray = [
      "texture",
      "mvpMatrix"
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

      if (vbo[i]) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo[i]);
        this.gl.enableVertexAttribArray(attL[i]);
        this.gl.vertexAttribPointer(attL[i], attS[i], this.gl.FLOAT, false, 0, 0);
      }
    }
    if (ibo) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
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
