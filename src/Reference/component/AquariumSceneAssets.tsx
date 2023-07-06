import { AccumulativeShadows, CameraControls, Environment, Float, Instance, Instances, Lightformer, OrbitControls, RandomizedLight, useAnimations, useGLTF } from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { use, useEffect } from "react"
import { useTh } from 'leva/dist/declarations/src/styles';
import { useControls } from "leva";

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
