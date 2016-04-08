precision highp float;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform vec3 ambientColor;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 vEyeDirection;
varying vec3 vLightDirection;


void main(void){
    vec3 mNormal = (texture2D(texture1, vTexCoord) * 2.0 - 1.0).rgb;
    vec3 halfLE = normalize(vLightDirection + vEyeDirection);
    float diffuse = clamp(dot(vLightDirection,mNormal) , 0.3 , 1.0);
    float specular = pow(clamp(dot(halfLE,mNormal),0.0,2.0),10.0);
    vec3 d = texture2D(texture0, vTexCoord).rgb * diffuse + specular * .5  + ambientColor.rgb;
    vec4 dc = vec4(d, 1.0);
    gl_FragColor = dc;
}
