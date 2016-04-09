#extension GL_OES_standard_derivatives : enable

precision highp float;
varying vec2 vTexCoord;


varying vec3 vNormal;
varying vec4 vColor;
varying vec4 vPosition;
varying vec4 mvpPosition;

uniform vec3 ambientColor;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 eyePosition;
uniform vec3 lookPoint;
uniform bool isLightEnable;
uniform bool isFlatShade;
uniform bool isTexture;
uniform sampler2D texture;
uniform float alpha;
uniform float diffuseIntensity;
uniform int specularIndex;


void main(){

  vec4 destColor = vec4(1.0);
  if(isLightEnable){
    vec3 eyeDirection = normalize(eyePosition - lookPoint);
    vec3 invEye = normalize(normalize(invMatrix * vec4(eyeDirection, 1.0)).xyz);
    vec3 invLight = (invMatrix * vec4(lightDirection,0.0)).xyz;
    vec3 halfVector = normalize(invLight + invEye);

    float specular = 0.0;
    if(specularIndex==1){
      //half vector specular
      specular = pow(clamp(dot(halfVector,vNormal),0.0,1.5),40.0);
    }else if(specularIndex==2){
      vec3 refVec = normalize(reflect((-invLight), vNormal));
      specular = pow(max(dot(invEye, refVec), 0.0), 90.0); // 鏡面光は視線ベクトルと反射光ベクトルの内積
    }
    //flat shading normalmap
    vec3 n;
    if(isFlatShade){
      vec3 dx = dFdx(vPosition.xyz);
      vec3 dy = dFdy(vPosition.xyz);
      n = normalize(cross(normalize(dx), normalize(dy)));
    }else{
      n = vNormal;
    }
    float diff = clamp(dot(n, invLight) ,.3,1.0)* 1. * diffuseIntensity;
    if(bool(isTexture)){
      vec4 col = texture2D(texture, vTexCoord);
      destColor = vec4(col.rgb*diff+specular + ambientColor.rgb  ,alpha * col.a);
    }else{
      vec4 col = vColor;
      destColor = vec4(col.rgb*diff+specular, col.a * alpha);
    }
  }else{
    destColor = vec4(vec3(1.0),0.2);
  }
  gl_FragColor = destColor;
}
