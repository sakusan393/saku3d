precision mediump float;
uniform sampler2D texture;

void main(){
    vec4 destColor = texture2D(texture, gl_PointCoord);
    if(destColor.a == 0.0){
        discard;
    }else{
        vec4 color = vec4(1.0,.4,.4,.9);
        gl_FragColor = color;
//            gl_FragColor = destColor * color;

    }
}
