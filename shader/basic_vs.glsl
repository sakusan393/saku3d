attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;
varying vec2 vTexCoord;
varying vec4 vColor;
uniform mat4 mvpMatrix;
uniform mat4 mMatrix;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 mvpPosition;

void main(){
    vNormal = normal;
    vTexCoord = texCoord;
    vColor = color;
    vPosition = mMatrix * vec4(position, 1.0);
    mvpPosition = mvpMatrix * vec4(position, 1.0);
    gl_Position = mvpPosition;
}
