#extension GL_OES_standard_derivatives : enable

precision highp float;
varying vec2 vTexCoord;
varying float noise;


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

float random( vec3 scale, float seed ){
    return fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed ) ;
}

void main(){

    vec4 destColor = vec4(1.0);
    if(isLightEnable){
        vec3 eyeDirection = normalize(cameraPosition - lookPoint);
        vec3 invEye = normalize(normalize(invMatrix * vec4(eyeDirection, 1.0)).xyz);
        vec3 invLight = (invMatrix * vec4(lightDirection,0.0)).xyz;
        vec3 halfVector = normalize(invLight + invEye);

        float specular = 0.0;
        if(specularIndex==1){
            //half vector specular
            specular = pow(clamp(dot(halfVector,vNormal),0.0,1.5),20.0) * specularIntensity;
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
        }else{
          n = vNormal;
        }
        float diff = clamp(dot(n, normalize(lightDirection)) ,.3,3.0)* .3 * diffuseIntensity;
        vec4 col;
        float ratio = 14.0;
        if(bool(isTexture)){
            col = texture2D(texture, vTexCoord);
            destColor = vec4(col.rgb*diff+specular+ ambientColor.rgb  ,alpha * col.a);

            float r = .01 * random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );
            vec2 tPos = vec2( 0, 1.0 - 1.8 * noise );
            col = texture2D( texture, tPos );
            destColor = vec4(col.rgb*diff+specular + ambientColor.rgb  ,clamp(alpha * col.a,0.0,1.0));
        }else{
            col = vec4(0.5,0.6,1.0,1.0);
            col = vec4(col.rgb*diff+specular, col.a * alpha);
            col.r = float(int(col.r * ratio)) / ratio;
            col.g = float(int(col.g * ratio)) / ratio;
            col.b = float(int(col.b * ratio)) / ratio;
            destColor = col;
        }
    }else{

    }
    gl_FragColor = destColor;
}
