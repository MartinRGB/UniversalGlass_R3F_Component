import { AccumulativeShadows, Box, CameraControls, Environment, Float, Icosahedron, Instance, Instances, Lightformer, OrbitControls, Plane, RandomizedLight, Sphere, useAnimations, useGLTF, useMask } from "@react-three/drei"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { useControls } from "leva";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from 'three'
import { Perf } from "r3f-perf";
import * as React from "react";
import { Html, useProgress } from '@react-three/drei'
import { UniversalGlassMaterial,UniversalGlassRenderController } from "../UniversalGlass/UniversalGlass";
import { TransmissionGlassContainer } from "@/Reference/component/TransmissionGlassContainer";
import { AquariumInside } from "@/Reference/component/AquariumSceneAssets";
import { AquariumGlassContainer } from "@/Reference/component/AquariumGlassContainer";
import { WineGlassContainer } from "@/Reference/component/WineGlassContainer";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Loader = () => {
    const { progress } = useProgress()
    return <Html center>{progress} % loaded</Html>
}




const UniversalGlassDemo = () =>{

    const {isUniversalGlass} = useControls('Glass Switcher',{
        isUniversalGlass: {value:true},
    })

    const icosahedronRef = useRef<any>()

    useFrame(({clock})=>{
        const time = clock.getElapsedTime();
        if(icosahedronRef.current){
            icosahedronRef.current.rotation.y = time * 1.;
            icosahedronRef.current.rotation.x = time * 1.;            
        }
    })

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
      } = useControls('Wine Glass',{
          normalScale: {value:0, min: 0, max: 10, step: 0.01 },
          overlayColor: {value:'#95a2ad'},
          overlayFactor: {value:1., min: 0, max: 1, step: 0.01 },
          refractionRatio: {value:1, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
          reflectionRatio: {value:1., min: 0.01, max: 1, step: 0.01 },
          reflectivity: {value:1., min: 0, max: 1, step: 0.01 },
          blurRadius: {value:0.1, min: 0.1, max: 3, step: 0.01 },
          LODLevel: {value:0.0, min: 0, max: 16, step: 1 },
          roughness: {value:0.3, min: 0, max: 1, step: 0.01,label:'roughness'},
          fresnelBias: {value:0.5, min: 0, max: 1, step: 0.01 },
          fresnelPower: {value:1., min: 0, max: 10, step: 0.01 },
          fresnelScale: {value:1., min: 0, max: 10, step: 0.01 },
    });

    const {
        normalScale1,
        overlayColor1,
        overlayFactor1,
        refractionRatio1,
        reflectionRatio1,
        reflectivity1,
        blurRadius1,
        LODLevel1,
        roughness1,
        fresnelBias1,
        fresnelPower1,
        fresnelScale1,
      } = useControls('Aquarium Glass',{
          normalScale1: {value:0, min: 0, max: 10, step: 0.01 },
          overlayColor1: {value:'#ffffff'},
          overlayFactor1: {value:0., min: 0, max: 1, step: 0.01 },
          refractionRatio1: {value:0.99, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
          reflectionRatio1: {value:0.0, min: 0.01, max: 1, step: 0.01 },
          reflectivity1: {value:1., min: 0, max: 1, step: 0.01 },
          blurRadius1: {value:0.1, min: 0.1, max: 3, step: 0.01 },
          LODLevel1: {value:0.0, min: 0, max: 16, step: 1 },
          roughness1: {value:0.3, min: 0, max: 1, step: 0.01,label:'roughness'},
          fresnelBias1: {value:0., min: 0, max: 1, step: 0.01 },
          fresnelPower1: {value:1., min: 0, max: 10, step: 0.01 },
          fresnelScale1: {value:1., min: 0, max: 10, step: 0.01 },
    });

    const {
        normalScale2,
        overlayColor2,
        overlayFactor2,
        refractionRatio2,
        reflectionRatio2,
        reflectivity2,
        blurRadius2,
        LODLevel2,
        roughness2,
        fresnelBias2,
        fresnelPower2,
        fresnelScale2,
      } = useControls('Geometry Glass',{
          normalScale2: {value:0, min: 0, max: 10, step: 0.01 },
          overlayColor2: {value:'#ff2e9c'},
          overlayFactor2: {value:1., min: 0, max: 1, step: 0.01 },
          refractionRatio2: {value:0.98, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
          reflectionRatio2: {value:0.8, min: 0.01, max: 1, step: 0.01 },
          reflectivity2: {value:1., min: 0, max: 1, step: 0.01 },
          blurRadius2: {value:0.35, min: 0.1, max: 3, step: 0.01 },
          LODLevel2: {value:0.0, min: 0, max: 16, step: 1 },
          roughness2: {value:0.2, min: 0, max: 1, step: 0.01,label:'roughness'},
          fresnelBias2: {value:0., min: 0, max: 1, step: 0.01 },
          fresnelPower2: {value:5., min: 0, max: 10, step: 0.01 },
          fresnelScale2: {value:3., min: 0, max: 10, step: 0.01 },
    });

    return(
        <>
        {isUniversalGlass?
        <>
        <UniversalGlassRenderController>
            <AquariumGlassContainer
            position={[0, 2.4, 0]}
            scale={[0.61 * 10, 0.8 * 10, 1 * 10]}
            normalMap={null}
            normalScale={normalScale1}
            overlayColor={overlayColor1}
            overlayFactor={overlayFactor1}
            refractionRatio={refractionRatio1}
            reflectionRatio={reflectionRatio1}
            reflectivity={reflectivity1}
            blurRadius={blurRadius1}
            LODLevel={LODLevel1}
            roughness={roughness1}
            fresnelBias={fresnelBias1}
            fresnelPower={fresnelPower1}
            fresnelScale={fresnelScale1}
            >
              <AquariumInside/>
            </AquariumGlassContainer>

            <WineGlassContainer
                scale={[80,80,80]}
                rotation = {[-Math.PI/2.,0,0]}
                position = {[-20,-5,12]}
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

            <Icosahedron args={[8,0]} position={[24,2,0]}>
                <UniversalGlassMaterial
                    normalMap={null}
                    normalScale={normalScale2}
                    overlayColor={overlayColor2}
                    overlayFactor={overlayFactor2}
                    refractionRatio={refractionRatio2}
                    reflectionRatio={reflectionRatio2}
                    reflectivity={reflectivity2}
                    blurRadius={blurRadius2}
                    LODLevel={LODLevel2}
                    roughness={roughness2}
                    fresnelBias={fresnelBias2}
                    fresnelPower={fresnelPower2}
                    fresnelScale={fresnelScale2}
                />
            </Icosahedron>
        </UniversalGlassRenderController>

        <Icosahedron ref={icosahedronRef} args={[2,0]} position={[24,2,0]}>
            <meshBasicMaterial 
                color={'#faebd7'}
            ></meshBasicMaterial>
        </Icosahedron>

        </>
        :
        <>
            <TransmissionGlassContainer 
            position={[0, 0.25, 0]}
            scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
            // samples={samples}
            // thickness={thickness}
            // roughness={roughness}
            // ior={ior}
            // chromaticAberration={chromaticAberration}
            // anisotropy={anisotropy}
            // distortion={distortion}
            // distortionScale={distortionScale?distortionScale:0}
            // temporalDistortion={temporalDistortion?temporalDistortion:0}
            // iridescence={iridescence}
            // iridescenceIOR={iridescenceIOR}
            // iridescenceThicknessRange={iridescenceThicknessRange}
            // attenuationColor={attenuationColor}
            // color={color}
            >
            <AquariumInside/>
            </TransmissionGlassContainer>
        </>
        }

        </>
    )
    
}

const Effect = () =>{

    const {autoRotate} = useControls('Glass Switcher',{
        autoRotate: {value:true}
    })

    return(
        <>

            <color attach="background" args={['#f0f0f0']} />
            <ambientLight intensity={0.515}></ambientLight>

            <Suspense fallback={
                <Loader/>
            }>

                {/* must render first */}
                <UniversalGlassDemo/>

                {/* shadow */}
                <AccumulativeShadows temporal frames={100} color="white" colorBlend={2} opacity={0.7} scale={120} position={[0, -5, 0]}>
                    <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
                </AccumulativeShadows>


                {/** Custom environment map */}
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
                
            </Suspense>
            <OrbitControls makeDefault autoRotate={autoRotate} />

            <Perf style={{position:'absolute',top:'10px',left:'10px',width:'360px',borderRadius:'10px'}}/>
        </>
    )

}

export const Demo = (props:any) =>{
    return(
      <>
        <Canvas shadows camera={{ position: [52, 4, -30], fov: 50, near: 0.001, far: 1000 }}>
            <Effect/>
        </Canvas>
      </>
    )
}

