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
uniform vec3 cameraPosition;
uniform vec3 lookPoint;
uniform bool isLightEnable;
uniform bool isFlatShade;
uniform bool isTexture;
uniform sampler2D texture;
uniform float alpha;
uniform float diffuseIntensity;
uniform float specularIntensity;
uniform int specularIndex;

const int BIT_COUNT = 8;

int modi(int x, int y) {
    return x - y * (x / y);
}

int or(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
            result += n;
        }
        a = a / 2;
        b = b / 2;
        n = n * 2;
        if(!(a > 0 || b > 0)) {
            break;
        }
    }
    return result;
}

int and(int a, int b) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
        }

        a = a / 2;
        b = b / 2;
        n = n * 2;

        if(!(a > 0 && b > 0)) {
            break;
        }
    }
    return result;
}

int not(int a) {
    int result = 0;
    int n = 1;

    for(int i = 0; i < BIT_COUNT; i++) {
        if (modi(a, 2) == 0) {
            result += n;
        }
        a = a / 2;
        n = n * 2;
    }
    return result;
}

void main(){

  vec4 destColor = vec4(1.0);
  if(isLightEnable){
    vec3 eyeDirection = normalize(cameraPosition - lookPoint);
    vec3 invEye = normalize(normalize(invMatrix * vec4(eyeDirection, 1.0)).xyz);
    vec3 invLight = (invMatrix * vec4(lightDirection,0.0)).xyz;
    vec3 light;
    vec3 halfVector = normalize(invLight + invEye);

    float specular = 0.0;
    if(specularIndex==1){
      //half vector specular
      specular = pow(clamp(dot(halfVector,vNormal),0.0,1.5),40.0) * specularIntensity;
    }else if(specularIndex==2){
      vec3 refVec = normalize(reflect((-invLight), vNormal));
      specular = pow(max(dot(invEye, refVec), 0.0), 90.0) * specularIntensity; // 鏡面光は視線ベクトルと反射光ベクトルの内積
    }
    //flat shading normalmap
    vec3 n;
    if(isFlatShade){
      vec3 dx = dFdx(vPosition.xyz);
      vec3 dy = dFdy(vPosition.xyz);
      n = normalize(cross(normalize(dx), normalize(dy)));
      light =  normalize(lightDirection);
    }else{
      n = vNormal;
      light =  normalize(invLight);
    }

    float diff = clamp(dot(n, light) ,0.3,1.0)* 1. * diffuseIntensity;

    if(bool(isTexture)){
      vec4 col = texture2D(texture, vTexCoord);
      destColor = vec4(col.rgb*diff+specular + ambientColor.rgb  ,alpha * col.a);
    }else{
      vec4 col = vColor;
//      col.r = float(int(col.r));
//      col.g = float(int(col.g));
//      col.b = float(int(col.b));
      col.r = float(and(int(col.r * 256.0), 180))/120.0;
      col.g = float(and(int(col.g * 256.0), 100))/120.0;
      col.b = float(and(int(col.b * 256.0), 100))/120.0;
      destColor = vec4(col.rgb*diff+specular, col.a * alpha);
    }
  }else{
    destColor = vColor;
  }
  gl_FragColor = destColor;
}
