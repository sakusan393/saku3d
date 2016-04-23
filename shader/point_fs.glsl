precision mediump float;
uniform sampler2D texture;
uniform bool isTexture;
varying vec4 vColor;

void main(){
    vec4 destColor;
    if(bool(isTexture)){
      destColor = texture2D(texture, gl_PointCoord);
    }else{
      destColor = vColor;
      destColor = vec4(1.0,.4,.4,1.0);
    }
    gl_FragColor = destColor;
//    if(destColor.a == 0.0 || false){
//        discard;
//    }else{
//
//    }
}
