precision mediump float;

uniform sampler2D texture;
uniform float     weight[10];
uniform float     horizonRatio;
uniform float     verticalRatio;
uniform bool      horizontal;
varying vec2      vTexCoord;

void main(void){
	float tFrag = 1.0 / horizonRatio;
	float tFrag2 = 1.0 / verticalRatio;
	vec2  fc;
	vec3  destColor = vec3(0.0);

	if(true){
		if(horizontal){
			fc = gl_FragCoord.st;
			destColor += texture2D(texture, vec2((fc.x - 9.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[9];
			destColor += texture2D(texture, vec2((fc.x - 8.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[8];
			destColor += texture2D(texture, vec2((fc.x - 7.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[7];
			destColor += texture2D(texture, vec2((fc.x - 6.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[6];
			destColor += texture2D(texture, vec2((fc.x - 5.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[5];
			destColor += texture2D(texture, vec2((fc.x - 4.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[4];
			destColor += texture2D(texture, vec2((fc.x - 3.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[3];
			destColor += texture2D(texture, vec2((fc.x - 2.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[2];
			destColor += texture2D(texture, vec2((fc.x - 1.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[1];
			destColor += texture2D(texture, vec2((fc.x - 0.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[0];
			destColor += texture2D(texture, vec2((fc.x - 1.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[1];
			destColor += texture2D(texture, vec2((fc.x - 2.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[2];
			destColor += texture2D(texture, vec2((fc.x - 3.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[3];
			destColor += texture2D(texture, vec2((fc.x - 4.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[4];
			destColor += texture2D(texture, vec2((fc.x - 5.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[5];
			destColor += texture2D(texture, vec2((fc.x - 6.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[6];
			destColor += texture2D(texture, vec2((fc.x - 7.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[7];
			destColor += texture2D(texture, vec2((fc.x - 8.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[8];
			destColor += texture2D(texture, vec2((fc.x - 9.0) * tFrag,(fc.y) * tFrag2)).rgb * weight[9];
		}else{
			fc = vec2(gl_FragCoord.s, gl_FragCoord.t);

      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 9.0) * tFrag2)).rgb * weight[9];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 8.0) * tFrag2)).rgb * weight[8];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 7.0) * tFrag2)).rgb * weight[7];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 6.0) * tFrag2)).rgb * weight[6];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 5.0) * tFrag2)).rgb * weight[5];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 4.0) * tFrag2)).rgb * weight[4];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 3.0) * tFrag2)).rgb * weight[3];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 2.0) * tFrag2)).rgb * weight[2];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 1.0) * tFrag2)).rgb * weight[1];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 0.0) * tFrag2)).rgb * weight[0];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 1.0) * tFrag2)).rgb * weight[1];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 2.0) * tFrag2)).rgb * weight[2];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 3.0) * tFrag2)).rgb * weight[3];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 4.0) * tFrag2)).rgb * weight[4];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 5.0) * tFrag2)).rgb * weight[5];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 6.0) * tFrag2)).rgb * weight[6];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 7.0) * tFrag2)).rgb * weight[7];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 8.0) * tFrag2)).rgb * weight[8];
      destColor += texture2D(texture, vec2((fc.x) * tFrag,(fc.y - 9.0) * tFrag2)).rgb * weight[9];
		}
	}else{
		destColor = texture2D(texture, vTexCoord).rgb;
	}

	gl_FragColor = vec4(destColor, 1.0);
}
