import { Box, Environment, Icosahedron, OrbitControls, Plane, Sphere } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { useControls } from "leva";
import { Suspense } from "react";
import * as THREE from 'three'
import { Perf } from "r3f-perf";
import * as React from "react";
import { Html, useProgress } from '@react-three/drei'
import TransmissionDemoReference from "../Reference/TransmissionDemoReference";
import CarScene from "../Reference/CarScene";
import { UniversalGlassMaterial,UniversalGlassRenderController } from "../UniversalGlass/UniversalGlass";

const Loader = () => {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}



const UniversalGlassDemo = () =>{

    const bgMap = useLoader(THREE.TextureLoader, './glass/bg2.jpg');
    const normalMap = useLoader(THREE.TextureLoader, './glass/normal.jpg');
    normalMap.repeat.set( 0.5, 0.5);

    const {
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
        cubeMapRenderTargetSize
    } = useControls('Glass',{
        normalScale: {value:0, min: 0, max: 10, step: 0.01 },
        overlayColor: {value:'#ffffff'},
        overlayFactor: {value:0, min: 0, max: 1, step: 0.01 },
        refractionRatio: {value:0.985, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
        reflectionRatio: {value:0.2, min: 0, max: 1, step: 0.01 },
        reflectivity: {value:1, min: 0, max: 1, step: 0.01 },
        blurRadius: {value:0.01, min: 0, max: 100, step: 0.01 },
        LODLevel: {value:0.0, min: 0, max: 16, step: 1 },
        fresnelBias: {value:0.1, min: 0, max: 1, step: 0.01 },
        fresnelPower: {value:1., min: 0, max: 10, step: 0.01 },
        fresnelScale: {value:1., min: 0, max: 10, step: 0.01 },
        cubeMapRenderTargetSize: {value:1024, min: 32, max: 2048, step: 256. },
    });


    return(
        <>
        
        <Suspense fallback={null}>

            <Perf style={{position:'absolute',top:'10px',left:'10px',width:'360px',borderRadius:'10px'}}/>
            <ambientLight intensity={0.515}></ambientLight>
            <Environment files="/glass/old_depot_2k.hdr" ground={{ height: 32, radius: 130 }} />
            <color attach="background" args={['#000000']} />
            <UniversalGlassRenderController>
                <Box args={[6,6,6,40,40,40]} position={[0,10,0]}>
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
                </Box>

                <Icosahedron args={[4,0]} position={[10,10,0]}>
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
                </Icosahedron>

                <Sphere args={[4,40,40]} position={[-10,10,0]}>
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
                </Sphere>
            </UniversalGlassRenderController>


            <Box args={[2,2,2]} position={[0,10,0]}>
                <meshPhongMaterial color={'blue'} />
            </Box>

            <Box args={[2,2,2]} position={[10,10,0]}>
                <meshPhongMaterial color={'red'} />
            </Box>

            <Box args={[2,2,2]} position={[-10,10,0]}>
                <meshPhongMaterial color={'green'} />
            </Box>

            <Plane  args={[50,50]} position={[0,10,-50]}>
                <meshBasicMaterial map={bgMap} ></meshBasicMaterial>
            </Plane>

            <OrbitControls />
        </Suspense>
        </>
    )
    
}


export const Effect = (props:any) =>{


    return(
      <>
          <Canvas 
            camera={{ position: [0, 20, 30], fov: 50, near: 0.1, far: 100000}}
            className={props.className} 
            style={{...props.style}}>
            <Suspense fallback={<Loader />}>
                <UniversalGlassDemo/>
                {/* <CarScene/> */}
            </Suspense>
          </Canvas>

        {/* <Canvas gl={{ logarithmicDepthBuffer: true, antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 25], fov: 25 }}>
            <CarScene/>
            <TransmissionDemoReference/>
            <OrbitControls/>
        </Canvas> */}
      </>
  
    )
}


