attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;
attribute vec3 instancedArrayPosition;
attribute float instancedArrayRandomSeed;
varying vec2 vTexCoord;
varying vec4 vColor;
uniform mat4 mvpMatrix;
uniform mat4 mMatrix;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 mvpPosition;
uniform float time;
uniform bool isInstancedArray;

#define HOGEE

void main(){
    instancedArrayRandomSeed;
    vNormal = normal;
    vTexCoord = texCoord;
    vColor = color;
    vPosition = mMatrix * vec4(position + instancedArrayPosition, 1.0);
    if(isInstancedArray){
      vec3 hoge;
      hoge.x = instancedArrayPosition.x + sin(time * instancedArrayRandomSeed * 0.1 + instancedArrayRandomSeed * 3.0) * 10.0;
      hoge.y = instancedArrayPosition.y + sin(time * instancedArrayRandomSeed * 0.2 + instancedArrayRandomSeed * 3.0) * 10.0;
      hoge.z = instancedArrayPosition.z + sin(time * instancedArrayRandomSeed * 0.3 + instancedArrayRandomSeed * 3.0) * 10.0;
      mvpPosition = mvpMatrix * vec4(position + hoge, 1.0);
    }else{
      mvpPosition = mvpMatrix * vec4(position, 1.0);
    }

    gl_Position = mvpPosition;
}
