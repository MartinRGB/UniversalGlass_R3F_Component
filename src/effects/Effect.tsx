import { AccumulativeShadows, Box, CameraControls, Environment, Float, Icosahedron, Instance, Instances, Lightformer, OrbitControls, Plane, RandomizedLight, Sphere, useAnimations, useGLTF, useMask } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useControls } from "leva";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from 'three'
import { Perf } from "r3f-perf";
import * as React from "react";
import { Html, useProgress } from '@react-three/drei'
import { UniversalGlassMaterial,UniversalGlassRenderController } from "../UniversalGlass/UniversalGlass";
import { GlassAquariumScene } from "@/Reference/GlassAquarium";

const Loader = () => {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}

const UniversalGlassDemo = () =>{

    const bgMap = useLoader(THREE.TextureLoader, './glass/bg2.jpg');
    const normalMap = useLoader(THREE.TextureLoader, './glass/normal.jpg');
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.minFilter = THREE.LinearFilter;
    normalMap.repeat.set( 12, 12.);

    const {
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
    } = useControls('Glass',{
        normalScale: {value:0, min: 0, max: 10, step: 0.01 },
        overlayColor: {value:'#ffffff'},
        overlayFactor: {value:0, min: 0, max: 1, step: 0.01 },
        refractionRatio: {value:0.985, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
        reflectionRatio: {value:0.2, min: 0.01, max: 1, step: 0.01 },
        reflectivity: {value:1, min: 0, max: 1, step: 0.01 },
        blurRadius: {value:0.5, min: 0.1, max: 3, step: 0.01 },
        LODLevel: {value:0.0, min: 0, max: 16, step: 1 },
        roughness: {value:0.0, min: 0, max: 1, step: 0.01},
        fresnelBias: {value:0.1, min: 0, max: 1, step: 0.01 },
        fresnelPower: {value:1., min: 0, max: 10, step: 0.01 },
        fresnelScale: {value:1., min: 0, max: 10, step: 0.01 },
    });

    const {
        groundHeight,
        groundRadius
    } = useControls('Radius',{
        groundHeight: {value:64},
        groundRadius: {value:300},
    });


    return(
        <>
        
        <Suspense fallback={null}>

            <Perf style={{position:'absolute',top:'10px',left:'10px',width:'360px',borderRadius:'10px'}}/>
            <ambientLight intensity={0.515}></ambientLight>

            {/* <color attach="background" args={['#000000']} /> */}
            {/* <color attach="background" args={['#c6e5db']} /> */}
            <Environment files="/glass/old_depot_2k.hdr" ground={{ height: groundHeight, radius: groundRadius }} />
            <Environment resolution={1024}>
                <group rotation={[-Math.PI / 3, 0, 0]}>
                <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                    <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
                ))}
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
                </group>
            </Environment>
            {/* <Environment resolution={1024}>
                <group rotation={[-Math.PI / 3, 0, 0]}>
                <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                    <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
                ))}
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
                </group>
            </Environment> */}
 



            <Instances renderOrder={-1000}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial depthTest={false} />
            {sphereArr.map(([scale, color, speed, position], index) => (
                <FloatSphere key={index} scale={scale} color={color} speed={speed} position={position} />
            ))}
            </Instances>

            <UniversalGlassRenderController>
                <UniversalGlassAquarium
                    position={[-10, 10, 0]}
                    normalMap={null}
                    normalScale={normalScale}
                    overlayColor={overlayColor}
                    overlayFactor={overlayFactor}
                    refractionRatio={refractionRatio}
                    reflectionRatio={reflectionRatio}
                    reflectivity={reflectivity}
                    blurRadius={blurRadius}
                    LODLevel={LODLevel}
                    roughness={roughness}
                    fresnelBias={fresnelBias}
                    fresnelPower={fresnelPower}
                    fresnelScale={fresnelScale}
                />
                
                {/* <Box args={[6,6,6,40,40,40]} position={[-10,10,0]}>
                    <UniversalGlassMaterial
                        normalMap={normalMap}
                        normalScale={normalScale}
                        overlayColor={overlayColor}
                        overlayFactor={overlayFactor}
                        refractionRatio={refractionRatio}
                        reflectionRatio={reflectionRatio}
                        reflectivity={reflectivity}
                        blurRadius={blurRadius}
                        LODLevel={LODLevel}
                        fresnelBias={fresnelBias}
                        fresnelPower={fresnelPower}
                        fresnelScale={fresnelScale}
                    />
                </Box> */}
                

                {/* <Icosahedron args={[4,0]} position={[10,10,0]}>
                    <UniversalGlassMaterial
                        normalMap={normalMap}
                        normalScale={normalScale}
                        overlayColor={overlayColor}
                        overlayFactor={overlayFactor}
                        refractionRatio={refractionRatio}
                        reflectionRatio={reflectionRatio}
                        reflectivity={reflectivity}
                        blurRadius={blurRadius}
                        LODLevel={LODLevel}
                        fresnelBias={fresnelBias}
                        fresnelPower={fresnelPower}
                        fresnelScale={fresnelScale}
                    />
                </Icosahedron> */}

                {/* <Sphere args={[4,40,40]} position={[0,10,0]}>
                    <UniversalGlassMaterial
                        normalMap={normalMap}
                        normalScale={normalScale}
                        overlayColor={overlayColor}
                        overlayFactor={overlayFactor}
                        refractionRatio={refractionRatio}
                        reflectionRatio={reflectionRatio}
                        reflectivity={reflectivity}
                        blurRadius={blurRadius}
                        LODLevel={LODLevel}
                        roughness={roughness}
                        fresnelBias={fresnelBias}
                        fresnelPower={fresnelPower}
                        fresnelScale={fresnelScale}
                    />
                </Sphere> */}
            </UniversalGlassRenderController>


            {/* <Aquarium1 position={[10, 10, 0]} /> */}

            <Box args={[2,2,2]} position={[0,10,0]}>
                <meshPhongMaterial color={'blue'} />
            </Box>

            <Box args={[2,2,2]} position={[10,10,0]}>
                <meshPhongMaterial color={'red'} />
            </Box>

            <Box args={[2,2,2]} position={[-10,10,0]}>
                <meshPhongMaterial color={'green'} />
            </Box>


            {/* <Plane  args={[100,100]} position={[0,25,-50]}>
                <meshBasicMaterial map={bgMap} ></meshBasicMaterial>
            </Plane> */}

            <OrbitControls makeDefault />
        </Suspense>
        </>
    )
    
}


export const Effect = (props:any) =>{


    return(
      <>
          <GlassAquariumScene/>
          {/* <Canvas 
            camera={{ position: [60, 150, 30], fov: 50, near: 0.0001, far: 1000000}}
            className={props.className} 
            style={{...props.style}}>
            <Suspense fallback={<Loader />}>
                <UniversalGlassDemo/>
            </Suspense>
          </Canvas> */}
      </>
    )
}


