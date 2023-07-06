import { AccumulativeShadows, CameraControls, Environment, Float, Instance, Instances, Lightformer, OrbitControls, RandomizedLight, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { use, useEffect } from "react"
import { useTh } from 'leva/dist/declarations/src/styles';

const sphereArr = [
    [1, 'orange', 0.05, [-4, -1, -1]],
    [0.75, 'hotpink', 0.1, [-4, 2, -2]],
    [1.25, 'aquamarine', 0.2, [4, -3, 2]],
    [1.5, 'lightblue', 0.3, [-4, -2, -3]],
    [2, 'pink', 0.3, [-4, 2, -4]],
    [2, 'skyblue', 0.3, [-4, 2, -4]],
    [1.5, 'orange', 0.05, [-4, -1, -1]],
    [2, 'hotpink', 0.1, [-4, 2, -2]],
    [1.5, 'aquamarine', 0.2, [4, -3, 2]],
    [1.25, 'lightblue', 0.3, [-4, -2, -3]],
    [1, 'pink', 0.3, [-4, 2, -4]],
    [1, 'skyblue', 0.3, [-4, 2, -4]]
]

const FloatSphere = ({ position = [0,0,0] ,scale = 1, speed = 0.1, color = 'white' }) =>{

    return (
        <Float rotationIntensity={40} floatIntensity={20} speed={speed / 2}>
          <Instance position={position} scale={scale} color={color} />
        </Float>
      )
}

const  Turtle = ({...props}) => {
    const { scene, animations }:any = useGLTF('./glass/model_52a_-_kemps_ridley_sea_turtle_no_id-transformed.glb')
    const { actions, mixer }:any = useAnimations(animations, scene)
    useEffect(() => {
      mixer.timeScale = 0.5
      actions['Swim Cycle'].play()
    }, [])
    useFrame((state) => (scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2))
    return (<primitive object={scene} {...props} />)
}

export const AquariumInside = () => {


    return (
    <>
        <Float rotationIntensity={2} floatIntensity={10} speed={2}>
            <Turtle position={[0, -0.5, -1]} rotation={[0, Math.PI, 0]} scale={23} />
        </Float>

        <Instances renderOrder={-1000}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial depthTest={false} />
            {sphereArr.map(([scale, color, speed, position], index) => (
                <FloatSphere key={index} scale={scale} color={color} speed={speed} position={position} />
            ))}
        </Instances>
    </>
    )
}

export const AquariumSceneTemplate = ({children}:{children?:React.ReactNode}) => {


    return (

        <Canvas shadows camera={{ position: [52, 7, -30], fov: 50, near: 0.001, far: 1000 }}>
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.515}></ambientLight>
        {/** Glass aquarium */}
        {children}
        {/** Soft shadows */}
        <AccumulativeShadows temporal frames={100} color="lightblue" colorBlend={2} opacity={0.7} scale={120} position={[0, -5, 0]}>
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
        <OrbitControls makeDefault />


        {/* <CameraControls truckSpeed={0} dollySpeed={0} minPolarAngle={0} maxPolarAngle={Math.PI / 2} /> */}
      </Canvas>

    )
}