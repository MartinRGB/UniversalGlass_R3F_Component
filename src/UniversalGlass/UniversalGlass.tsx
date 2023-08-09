import { shaderMaterial, useDepthBuffer } from "@react-three/drei"
import { useThree, useFrame } from "@react-three/fiber"
import {  useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import * as React from "react";
import { useControls } from 'leva';
import { 
    Prefix_Frag_Attribute,
    Prefix_Vert_Noise,
    Replacement_Vertex_ENV,
    Prefix_Frag_Rand,
    Prefix_Frag_ENV,
    Replacement_Frag_ENV,
    Suffix_Frag_ENV,
    Prefix_Vert_Attribute
} from './shader/Glass_Shader';

const DiscardMaterial = shaderMaterial(
    {},
    'void main() { }',
    'void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }'
)

export const UniversalGlassMaterial = ({
    normalMap,
    normalScale,
    overlayColor,
    overlayFactor,
    refractionRatio,
    reflectionRatio,
    reflectivity,
    blurRadius,
    LODLevel,
    roughness,
    fresnelBias,
    fresnelPower,
    fresnelScale,
    cubeMapRenderTargetSize,
}:{
    normalMap?:THREE.Texture,
    normalScale?:number,
    overlayColor?:THREE.ColorRepresentation,
    overlayFactor?:number,
    refractionRatio?:number,
    reflectionRatio?:number,
    reflectivity?:number,
    blurRadius?:number,
    LODLevel?:number,
    roughness?:number,
    fresnelBias?:number,
    fresnelPower?:number,
    fresnelScale?:number,
    cubeMapRenderTargetSize?:number
}) =>{

    const glassMatRef = useRef<any>();
    const {scene,gl,camera} = useThree();

    const cubeMapRenderTargetSettings = {
        generateMipmaps:true,
        minFilter:THREE.LinearMipmapLinearFilter,
        magFilter:THREE.LinearFilter,
    }

    const [cubeMapRT,reflectMapRT] = React.useMemo(()=>{
        return [
            new THREE.WebGLCubeRenderTarget(cubeMapRenderTargetSize?cubeMapRenderTargetSize:1024,cubeMapRenderTargetSettings),
            new THREE.WebGLCubeRenderTarget(cubeMapRenderTargetSize?cubeMapRenderTargetSize:1024,cubeMapRenderTargetSettings),
        ]
    },[])
    const cubeMapCamRef = useRef<THREE.CubeCamera>(new THREE.CubeCamera(0.000001,10000,cubeMapRT));
    const reflectMapCamRef = useRef<THREE.CubeCamera>(new THREE.CubeCamera(0.000001,10000,reflectMapRT));
   
    let FBOSettings = { format: THREE.RGBAFormat,minFilter: THREE.LinearFilter,magFilter: THREE.LinearFilter,type: THREE.FloatType,}

    const fboMainRef = useRef<THREE.WebGLRenderTarget>(new THREE.WebGLRenderTarget(512,512,FBOSettings))

    const [isShaderCompiled,setIsShaderCompiled] = useState(false);
  
    useEffect(()=>{
        if(cubeMapRenderTargetSize){
            cubeMapRT.setSize(cubeMapRenderTargetSize,cubeMapRenderTargetSize);
        }
    },[cubeMapRenderTargetSize])


    useFrame(() => {

        // *** Init the shader
        if(!isShaderCompiled && glassMatRef.current){
            // *** get material's mesh parent ***
            const parent = (glassMatRef.current as any).__r3f.parent as THREE.Object3D;
            cubeMapCamRef.current.position.copy(camera.position);
            cubeMapRT.texture.mapping = THREE.CubeRefractionMapping;
            scene.add(cubeMapCamRef.current);

            reflectMapRT.texture.mapping = THREE.CubeRefractionMapping;
            scene.add(reflectMapCamRef.current);

            // *** init the glass shader ***
            glassMatRef.current.onBeforeCompile = (shader:any) => {
                shader.uniforms.mRefractionRatio = { value:refractionRatio?refractionRatio:0.985}
                shader.uniforms.mReflectionRatio = { value:reflectionRatio?reflectionRatio:0.2}
                shader.uniforms.roughness = {value:roughness?roughness:0.}
                shader.uniforms.mFresnelBias = { value:fresnelBias?fresnelBias:0.1}
                shader.uniforms.mFresnelPower = { value:fresnelPower?fresnelPower:1.}
                shader.uniforms.mFresnelScale = { value:fresnelScale?fresnelScale:1.}
                shader.uniforms.blurRadius = { value:blurRadius?Math.max(0.001,blurRadius/100):0.1}
                shader.uniforms.lodLvl = { value:LODLevel?LODLevel:0.0}
                shader.uniforms.overlayColor = { value:overlayColor?new THREE.Color(overlayColor):new THREE.Vector3(0,0,0)}
                shader.uniforms.overlayFactor = { value:overlayFactor?overlayFactor:0}
                shader.uniforms.reflectMap = { value:reflectMapRT.texture}

                shader.vertexShader = Prefix_Vert_Attribute + Prefix_Vert_Noise + shader.vertexShader;
                shader.fragmentShader = Prefix_Frag_Attribute + Prefix_Frag_Rand + shader.fragmentShader;
                shader.vertexShader = shader.vertexShader.replace(
                    `#include <envmap_vertex>`,
                    Replacement_Vertex_ENV,  
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    `#include <envmap_fragment>`,
                    Prefix_Frag_ENV + Replacement_Frag_ENV + Suffix_Frag_ENV,
                );

                parent.userData.shader = shader;
                parent.cubeMapCameraRef = cubeMapCamRef.current;
                parent.reflectMapCamRef = reflectMapCamRef.current;
                //parent.fboMainRef = fboMainRef.current;
                parent.isUniversalGlass = true;
                setIsShaderCompiled(true);
            }
        }
        
        // *** Update The Shader
        if( isShaderCompiled && glassMatRef.current){ 

            const parent = (glassMatRef.current as any).__r3f.parent as THREE.Object3D;
            // *** update shader 
            parent.userData.shader.uniforms.mRefractionRatio = { value:refractionRatio?refractionRatio:0.985}
            parent.userData.shader.uniforms.mReflectionRatio = { value:reflectionRatio?reflectionRatio:0.2}
            parent.userData.shader.uniforms.roughness = {value:roughness?roughness:0.}
            parent.userData.shader.uniforms.mFresnelBias = { value:fresnelBias?fresnelBias:0.1}
            parent.userData.shader.uniforms.mFresnelPower = { value:fresnelPower?fresnelPower:1.}
            parent.userData.shader.uniforms.mFresnelScale = { value:fresnelScale?fresnelScale:1.}
            parent.userData.shader.uniforms.blurRadius = { value:blurRadius?Math.max(0.001,blurRadius/100):0.1}
            parent.userData.shader.uniforms.lodLvl = { value:LODLevel?LODLevel:0.0}
            parent.userData.shader.uniforms.overlayColor = { value:overlayColor?new THREE.Color(overlayColor):new THREE.Vector3(0,0,0)}
            parent.userData.shader.uniforms.overlayFactor = { value:overlayFactor?overlayFactor:0}
            parent.userData.shader.uniforms.reflectMap = { value:reflectMapRT.texture}
        }

    },)
    
    return(
        <>
            <meshPhongMaterial 
                ref={glassMatRef}
                envMap={cubeMapCamRef.current.renderTarget.texture}

                normalMap={normalMap?normalMap:null}
                normalScale={normalScale?new THREE.Vector2(normalScale,normalScale):new THREE.Vector2(1,1)}
                
                reflectivity={reflectivity?reflectivity:1}
                refractionRatio={refractionRatio?refractionRatio:0.985}

                combine={THREE.MixOperation}
                transparent={true}
                // shininess={10000}
                // specular={'#ffffff'}

            />
        </>
    )
                
}

export const UniversalGlassRenderController = ({children}:{children:React.ReactNode}) =>{

    const depthBuffer = useDepthBuffer({ frames: 1 })
    const {scene,gl,camera,controls} = useThree();
    const distArrRef = useRef<any>([]);
    const childrenRef = useRef<any>();



    useFrame((state)=>{

        let oldBg:any
        let oldTone:any

        if(childrenRef.current){
            
            distArrRef.current = [];

            childrenRef.current.traverse((obj:any)=>{
                if(obj.isMesh && obj.isUniversalGlass){
                    const dist = camera.position.distanceTo(obj.position);
                    distArrRef.current.push({dist:dist,obj:obj});
                }
                // if(obj.isMesh){
                //     const dist = camera.position.distanceTo(obj.position);
                //     distArrRef.current.push({dist:dist,obj:obj});
                // }
            })

            // *** sort by distance,render the nearest first
            distArrRef.current.sort(function(a:any, b:any) {
                var keyA = a.dist,
                    keyB = b.dist;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });


            //console.log(camera.position)
            distArrRef.current.forEach((item:any,index:number)=>{
                distArrRef.current.renderOrder = index;
                if(item.obj.cubeMapCameraRef){

                    // Save defaults
                    oldTone = state.gl.toneMapping
                    oldBg = state.scene.background
                    // Switch off tonemapping lest it double tone maps
                    state.gl.toneMapping = THREE.NoToneMapping

                    // *** "Feedback loop formed between Framebuffer and active Texture" - Rendering Reflections
                    // *** discussion here:https://stackoverflow.com/questions/69710407/three-js-error-feedback-loop-formed-between-framebuffer-and-active-texture
                    item.obj.visible = false;
                    // *** 'EnvMap generated with CubeCamera looks magnified'
                    // *** https://discourse.threejs.org/t/envmap-generated-with-cubecamera-looks-magnified/18570/6
                    // *** if use parent.position, the reflection EnvMap will be magnified
               
                    // gl.setRenderTarget(item.obj.fboMainRef);
                    item.obj.cubeMapCameraRef.position.copy(camera.position);
                    item.obj.cubeMapCameraRef.update( gl, scene );

                    item.obj.reflectMapCamRef.position.copy(item.obj.position);
                    item.obj.reflectMapCamRef.update( gl, scene );


                    //item.obj.renderOrder = 999 + index;
                
                    // *** comment this or will generate color error;
                    //item.obj.visible = true;

                }
            })

            distArrRef.current.forEach((item:any,index:number)=>{
                if(item.obj.cubeMapCameraRef){
                    item.obj.visible = true;
                    // gl.render(scene, camera)
                    // gl.setRenderTarget(null);
                    
                }

                if(index === distArrRef.current.length - 1){
                    // Set old state back  - finish a render loop
                    state.scene.background = oldBg
                    state.gl.toneMapping = oldTone
                }

            })


        }

    },)

    return(
        <>
            <group ref={childrenRef}>
                {children}
            </group>
        </>
    )
}