attribute vec3 position;
uniform mat4 mvpMatrix;

void main(){
    gl_Position = mvpMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0;
}
