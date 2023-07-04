import { useDepthBuffer } from "@react-three/drei"
import { useThree, useFrame } from "@react-three/fiber"
import {  useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import * as React from "react";
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
    }

    const [cubeMapRT] = React.useMemo(()=>{
        return [
            new THREE.WebGLCubeRenderTarget(cubeMapRenderTargetSize?cubeMapRenderTargetSize:512,cubeMapRenderTargetSettings),
        ]
    },[])
    const cubeMapCamRef = useRef<THREE.CubeCamera>(new THREE.CubeCamera(0.1,100000,cubeMapRT));

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

            // *** init the glass shader ***
            glassMatRef.current.onBeforeCompile = (shader:any) => {
                shader.uniforms.mRefractionRatio = { value:refractionRatio?refractionRatio:0.985}
                shader.uniforms.mReflectionRatio = { value:reflectionRatio?reflectionRatio:0.2}
                shader.uniforms.mFresnelBias = { value:fresnelBias?fresnelBias:0.1}
                shader.uniforms.mFresnelPower = { value:fresnelPower?fresnelPower:1.}
                shader.uniforms.mFresnelScale = { value:fresnelScale?fresnelScale:1.}
                shader.uniforms.blurRadius = { value:blurRadius?blurRadius/100:0.01}
                shader.uniforms.LODLevel = { value:LODLevel?LODLevel:0.0}
                shader.uniforms.overlayColor = { value:overlayColor?new THREE.Color(overlayColor):new THREE.Vector3(0,0,0)}
                shader.uniforms.overlayFactor = { value:overlayFactor?overlayFactor:0}

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
                //setIsShaderCompiled(true);
            }
        }
        
        // *** Update The Shader
        if(isShaderCompiled && glassMatRef.current){ 

            const parent = (glassMatRef.current as any).__r3f.parent as THREE.Object3D;
            // *** update shader 
            parent.userData.shader.uniforms.mRefractionRatio = { value:refractionRatio?refractionRatio:0.985}
            parent.userData.shader.uniforms.mReflectionRatio = { value:reflectionRatio?reflectionRatio:0.2}
            parent.userData.shader.uniforms.mFresnelBias = { value:fresnelBias?fresnelBias:0.1}
            parent.userData.shader.uniforms.mFresnelPower = { value:fresnelPower?fresnelPower:1.}
            parent.userData.shader.uniforms.mFresnelScale = { value:fresnelScale?fresnelScale:1.}
            parent.userData.shader.uniforms.blurRadius = { value:blurRadius?blurRadius/100:0.01}
            parent.userData.shader.uniforms.LODLevel = { value:LODLevel?LODLevel:0.0}
            parent.userData.shader.uniforms.overlayColor = { value:overlayColor?new THREE.Color(overlayColor):new THREE.Vector3(0,0,0)}
            parent.userData.shader.uniforms.overlayFactor = { value:overlayFactor?overlayFactor:0}

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
                shininess={10000}
                specular={'#ffffff'}

            />
        </>
    )
                
}

export const UniversalGlassRenderController = ({children}:{children:React.ReactNode}) =>{

    const depthBuffer = useDepthBuffer({ frames: 1 })
    const {scene,gl,camera} = useThree();
    const distArrRef = useRef<any>([]);
    const childrenRef = useRef<any>();

    useFrame(()=>{
        if(childrenRef.current){
            
            distArrRef.current = [];

            childrenRef.current.traverse((obj:any)=>{
                if(obj.isMesh){
                    const dist = camera.position.distanceTo(obj.position);
                    distArrRef.current.push({dist:dist,obj:obj});
                }
            })

            // *** sort by distance,render the nearest first
            distArrRef.current.sort(function(a:any, b:any) {
                var keyA = a.dist,
                    keyB = b.dist;
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            distArrRef.current.forEach((item:any,index:number)=>{
                if(item.obj.cubeMapCameraRef){
                    // *** "Feedback loop formed between Framebuffer and active Texture" - Rendering Reflections
                    // *** discussion here:https://stackoverflow.com/questions/69710407/three-js-error-feedback-loop-formed-between-framebuffer-and-active-texture
                    item.obj.visible = false;
                    // *** 'EnvMap generated with CubeCamera looks magnified'
                    // *** https://discourse.threejs.org/t/envmap-generated-with-cubecamera-looks-magnified/18570/6
                    // *** if use parent.position, the reflection EnvMap will be magnified
                    item.obj.cubeMapCameraRef.position.copy(camera.position);
                    item.obj.cubeMapCameraRef.update( gl, scene );
                    // *** comment this or will generate color error;
                    //item.obj.visible = true;
                }
            })

            distArrRef.current.forEach((item:any,index:number)=>{
                if(item.obj.cubeMapCameraRef){
                    item.obj.visible = true;
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