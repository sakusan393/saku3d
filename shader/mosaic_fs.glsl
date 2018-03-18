precision mediump float;

uniform sampler2D texture;
varying vec2       vTexCoord;
uniform float      horizonRatio;
uniform float      verticalRatio;
uniform bool       isEffectEnabled;
uniform bool       isOneTone;
uniform int        pixelCount;

const float redScale   = 0.298912;
const float greenScale = 0.586611;
const float blueScale  = 0.114478;
const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);

void main(void){
	vec2 vUv2 = vTexCoord;

  if(isEffectEnabled){
	  float fMosaicScale = horizonRatio/float(pixelCount);
    vUv2.x = floor(vTexCoord.x  * horizonRatio / fMosaicScale) / (horizonRatio / fMosaicScale) + (fMosaicScale/2.0) / horizonRatio;
    vUv2.y = floor(vTexCoord.y  * verticalRatio / fMosaicScale) / (verticalRatio / fMosaicScale) + (fMosaicScale/2.0) / verticalRatio;
  }

	vec4 smpColor = texture2D(texture, vUv2);
  if(isOneTone){
    float grayColor = dot(smpColor.rgb, monochromeScale);
    smpColor = vec4(vec3(grayColor), 1.0);
    smpColor.r = smpColor.r * 0.6;
    smpColor.b = smpColor.b * 0.3;
  }
	gl_FragColor = smpColor;
}
