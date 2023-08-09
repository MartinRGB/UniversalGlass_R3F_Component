// ***********************
// this is the main shader code for the UniversalGlass
// ***********************
export const Prefix_Vert_Attribute = `
// *** Thin Film varying
varying vec3 Normal;
varying vec3 Position;

// *** output to properties
uniform float mRefractionRatio;
uniform float mReflectionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;
uniform float roughness;
varying vec3 vReflect;

varying vec3 vRefract_[3];
varying float vReflectionFactor_;
varying vec3 vTransformedNormal;
// *** distortion
uniform float time;

// *** if PhysicalMaterial delete this
//#include <normal_pars_vertex>
//varying vec3 vViewPosition;
//varying vec2 vUv;
`

export const Prefix_Vert_Noise = `
// *** Utils
vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// *** Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

// *** Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}
`

export const Replacement_Vertex_ENV=`

#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition ); //1
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix ); //1
		#ifdef ENVMAP_MODE_REFLECTION
            vReflect = reflect( cameraToVertex, worldNormal );
		#else
            // ** add this line
            vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif

vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix ) ; //1

vRefract_[0] = refract( normalize( cameraToVertex ), worldNormal, mRefractionRatio ); //worldNormal -> normal
vRefract_[1] = refract( normalize( cameraToVertex ), worldNormal, mRefractionRatio * 0.99 ); //worldNormal -> normal
vRefract_[2] = refract( normalize( cameraToVertex ), worldNormal, mRefractionRatio * 0.98 ); //worldNormal -> normal


vReflect = reflect(  cameraToVertex , worldNormal );

// float roughnessFactor = roughness;
// vec3 sampleNorm = normalize(worldNormal + roughnessFactor * roughnessFactor * 2. * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33));

vReflectionFactor_ = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( cameraToVertex ), worldNormal ), mFresnelPower );
vTransformedNormal = transformedNormal;

// #include <fog_vertex>
// #include <normal_vertex>
Normal = normalize(normalMatrix * normal);
Position = vec3(modelViewMatrix * vec4(position, 1.0));
`

export const Prefix_Frag_Attribute = `
// *** https://www.shadertoy.com/view/4l2BWh# ***
// *** blurred reflections ***

// *** Thin Film varying
varying vec3 Normal;
varying vec3 Position;
varying vec3 vTransformedNormal;

varying vec3 vRefract_[3];
varying vec3 vReflect;
varying float vReflectionFactor_;
uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;

uniform float blurRadius;
uniform float lodLvl;
uniform vec3 overlayColor;
uniform float overlayFactor;
uniform samplerCube reflectMap;

uniform float roughness;
uniform float mReflectionRatio;

float seed = 0.0;
uint hash( uint x ) {
  x += ( x << 10u );
  x ^= ( x >>  6u );
  x += ( x <<  3u );
  x ^= ( x >> 11u );
  x += ( x << 15u );
  return x;
}

// Compound versions of the hashing algorithm I whipped together.
uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

// Construct a float with half-open range [0:1] using low 23 bits.
// All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
float floatConstruct( uint m ) {
  const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
  const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
  m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
  m |= ieeeOne;                          // Add fractional part to 1.0
  float  f = uintBitsToFloat( m );       // Range [1:2]
  return f - 1.0;                        // Range [0:1]
}

// Pseudo-random value in half-open range [0:1].
float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }

float rand() {
  float result = random(vec3(gl_FragCoord.xy, seed));
  seed += 1.0;
  return result;
}


// *** if Physic delete this
//#include <normalmap_pars_fragment>
// varying vec2 vUv;
// vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 mapN, float faceDirection ) {
//     vec3 q0 = dFdx( eye_pos.xyz );
//     vec3 q1 = dFdy( eye_pos.xyz );
//     vec2 st0 = dFdx( vUv.st );
//     vec2 st1 = dFdy( vUv.st );
//     vec3 N = surf_norm;
//     vec3 q1perp = cross( q1, N );
//     vec3 q0perp = cross( N, q0 );
//     vec3 T = q1perp * st0.x + q0perp * st1.x;
//     vec3 B = q1perp * st0.y + q0perp * st1.y;
//     float det = max( dot( T, T ), dot( B, B ) );
//     float scale = ( det == 0.0 ) ? 0.0 : faceDirection * inversesqrt( det );
//     return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
// }
// uniform vec2 normalScale;
// uniform sampler2D normalMap;
// varying vec3 vViewPosition;

// *** Color Blending Functions

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

`


export const Prefix_Frag_Rand = `
vec3 randVec3(int i)
{
    float s = float(i); // seed
    return vec3( fract( sin(s*6793.6)*2986.3 )*2.0-1.0
            , fract( sin(s*9365.3)*9374.5 )*2.0-1.0
            , fract( sin(s*2347.2)*8264.7 )*2.0-1.0
            );
}
`

export const Prefix_Frag_ENV = `
vec3 cameraToFrag;
vec3 worldNormal;
vec3 reflectVec;
vec3 refractVec;
#ifdef USE_ENVMAP
#ifdef ENV_WORLDPOS
    //vec3 cameraToFrag;
    if ( isOrthographic ) {
        cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
    } else {
        cameraToFrag = normalize( vWorldPosition - cameraPosition );
    }
    worldNormal = inverseTransformDirection( normal, viewMatrix ); //normal
    #ifdef ENVMAP_MODE_REFLECTION
        reflectVec = reflect( cameraToFrag, worldNormal );
    #else

        // *** this influences the next functions;
        vec3 normalizedWorldPos = normalize( vWorldPosition );
        reflectVec = reflect( vec3(normalizedWorldPos.x,-normalizedWorldPos.y,-normalizedWorldPos.z), worldNormal );
        
        // ***  I added this line
        refractVec = refract( cameraToFrag, worldNormal, refractionRatio ); // worldNormal
    #endif
#else
    //insert here
    //reflectVec = vReflect;
    cameraToFrag = normalize( vWorldPosition - cameraPosition );
#endif

`

export const Replacement_Frag_ENV =`
#ifdef ENVMAP_TYPE_CUBE
// modified by orig frag shader
vec3 refractDir = vec3( flipEnvMap * refractVec.x, refractVec.yz );
vec3 reflectDir = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );



// *** roughness Funcs here
vec3 vRefract[3] = vRefract_;
float vReflectionFactor = vReflectionFactor_;

float roughnessFactor = roughness;
vec3 sampleRoughness = normalize(worldNormal + roughnessFactor * roughnessFactor * 2. * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33));

vRefract[0] = refract( cameraToFrag, sampleRoughness, mRefractionRatio ); // worldNormal
vRefract[1] = refract( cameraToFrag, sampleRoughness, mRefractionRatio * 0.99 ); // worldNormal
vRefract[2] = refract( cameraToFrag, sampleRoughness, mRefractionRatio * 0.98); // worldNormal


// *** iteration this in blur

vec4 finalCol;

vec4 reflectedColor = textureLod( reflectMap, reflectDir,lodLvl); //textureCube
vec4 refractedColor = vec4( 1.0 );

// *** dispersion Funcs here

// *** https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/shaders/FresnelShader.js ***
// ## bubble
refractedColor.r = textureLod( envMap, vec3( flipEnvMap * vRefract[0].x, vRefract[0].yz ), lodLvl ).r;
refractedColor.g = textureLod( envMap, vec3( flipEnvMap * vRefract[1].x, vRefract[1].yz ), lodLvl ).g;
refractedColor.b = textureLod( envMap, vec3( flipEnvMap * vRefract[2].x, vRefract[2].yz ), lodLvl ).b;

// **** https://www.shadertoy.com/view/4l2BWh# ***
// *** blurred reflections ***
// *** bubble start
int SAMPLING_RATE = 4;
float r = blurRadius;
vec3 v = refractDir; // refractDir Before
int maxS = SAMPLING_RATE;
vec3 c = reflectedColor.rgb;
vec3 rv;
vec3 offset;
float w, tw = 0.0;

vec3 d = refractedColor.rgb;
vec3 rw0,rw1,rw2;
float x0, tx0,x1,tx1,x2,tx2 = 0.0;


//| RANDOM SAMPLING - look up texture maxS^2 times in a radius r around v
for (int i=0; i<maxS*maxS; i++)
{
    offset = randVec3(i) * r;

    rv = v + offset;
    tw = length(rv); // account for sampling distance
    c += texture(envMap, rv,lodLvl).rgb * tw;
    w += tw; // values less than 1 like 0.85 fake bloom of bright areas
                // could be handy for specularity
    

    // ## bubble

    // ***  original
    rw0 = vec3( flipEnvMap * vRefract[0].x, vRefract[0].yz ) + offset ;
    rw1 = vec3( flipEnvMap * vRefract[1].x, vRefract[1].yz ) + offset ;
    rw2 = vec3( flipEnvMap * vRefract[2].x, vRefract[2].yz ) + offset ;

    tx0 = length(rw0);
    tx1 = length(rw1);
    tx2 = length(rw2);

    vec4 resetColor = vec4(1.);
    resetColor.r = textureLod( envMap, rw0, lodLvl ).r;
    resetColor.g = textureLod( envMap, rw1, lodLvl ).g;
    resetColor.b = textureLod( envMap, rw2, lodLvl ).b;

    d += resetColor.rgb * vec3(tx0,tx1,tx2);
    x0 += tx0;
    x1 += tx1;
    x2 += tx2;

}
reflectedColor.rgb = mix(c/(w+1.0),textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) ).rgb,mReflectionRatio);
refractedColor.rgb = vec3(d.x/(x0+1.),d.y/(x1+1.),d.z/(x2+1.));
//
//refractedColor.rgb = vec3(1.,0.,0.);

// *** bubble end

finalCol = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 )*1. );
//envColor = mix( refractedColor, envColor, 1. - mRefractionRatio );

// *** https://www.shadertoy.com/view/XdVcDm ***
// *** Water Sphere - Refraction  ***
//envColor.rgb = intersectsWithWorld(cameraPosition,envMap,dir);

#elif defined( ENVMAP_TYPE_CUBE_UV )
vec4 finalCol = textureCubeUV( envMap, reflectVec, 0.0 );
#else
vec4 finalCol = vec4( 0.0 );
#endif

//reflectedColor.rgb =vec3(1.,0.,0.);

finalCol.xyz = blendOverlay(finalCol.xyz,overlayColor,overlayFactor);
`

export const Suffix_Frag_ENV = `
#ifdef ENVMAP_BLENDING_MULTIPLY
    outgoingLight = mix( outgoingLight, outgoingLight * finalCol.xyz, specularStrength * reflectivity );
#elif defined( ENVMAP_BLENDING_MIX )
    outgoingLight = mix( outgoingLight, finalCol.xyz, specularStrength * reflectivity );
#elif defined( ENVMAP_BLENDING_ADD )
    outgoingLight += finalCol.xyz * specularStrength * reflectivity;
#endif
#endif
`
