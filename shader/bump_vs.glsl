precision highp float;
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 invMatrix;
uniform vec3 lightDirection;
uniform vec3 cameraPosition;

varying vec4 vColor;
varying vec2 vTexCoord;
varying vec3 vEyeDirection;
varying vec3 vLightDirection;

void main(){
    vec3 lightPosition = vec3(-10.0, 10.0, 10.0);
    vec3 pos = (mMatrix * vec4(position, 0.0)).xyz;
    vec3 invEye = (invMatrix * vec4(cameraPosition, 1.0)).xyz;
    vec3 invLight = (invMatrix * vec4(lightDirection,0.0)).xyz;
    vec3 eye = invEye - pos;
    vec3 light = invLight - pos;
    vec3 n = normalize(normal);
    vec3 t = normalize(cross(normal, vec3(0.0,1.0,0.0)));
    vec3 b = cross(n,t);
    vEyeDirection.z = dot(n, eye);
    vEyeDirection.x = dot(t, eye);
    vEyeDirection.y = dot(b, eye);
    vEyeDirection = normalize(vEyeDirection);
    vLightDirection.z  =dot(n,light);
    vLightDirection.x  =dot(t,light);
    vLightDirection.y  =dot(b,light);
    vLightDirection = normalize(vLightDirection);
    vColor = color;
    vTexCoord = texCoord;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
