import { MeshTransmissionMaterial } from "@/UniversalGlass/MeshTransmissionMaterial"
import { useGLTF, useMask } from "@react-three/drei"
import { useControls } from "leva"
import { useLayoutEffect, useRef } from "react"

export const TransmissionGlassContainer = ({ 

    // samples,
    // thickness,
    // roughness,
    // ior,
    // chromaticAberration,
    // anisotropy,
    // distortion,
    // distortionScale,
    // temporalDistortion,
    // iridescence,
    // iridescenceIOR,
    // iridescenceThicknessRange,
    // attenuationColor,
    // color,
    levaName,
    children,
    ...props
  }:{
    // samples?:number
    // thickness?:number
    // roughness?:number
    // ior?:number
    // chromaticAberration?:number
    // anisotropy?:number
    // distortion?:number
    // distortionScale?:number
    // temporalDistortion?:number
    // iridescence?:number
    // iridescenceIOR?:number
    // iridescenceThicknessRange?:[number,number]
    // attenuationColor?:THREE.ColorRepresentation
    // color?:THREE.ColorRepresentation
    levaName?:string
    children?:React.ReactNode
  } ) => {
    const ref = useRef<any>()
    const { nodes }:any = useGLTF('./glass/shapes-transformed.glb')
    const stencil = useMask(1, false)

    const {
        samples,
        thickness,
        roughness,
        ior,
        chromaticAberration,
        anisotropy,
        distortion,
        distortionScale,
        temporalDistortion,
        iridescence,
        iridescenceIOR,
        iridescenceThicknessRange,
        attenuationColor,
        color,
  
    } = useControls('Transmission Glass',{
        samples: {value:4, min: 0, max: 16, step: 1 },
        thickness: {value:3, min: 0, max: 10, step: 0.01 },
        roughness: {value:0., min: 0, max: 1, step: 0.01 },
        ior: {value:1.5, min: 0, max: 2, step: 0.01 },
        chromaticAberration: {value:0.025, min: 0, max: 1, step: 0.01 },
        anisotropy: {value:0.1, min: 0, max: 1, step: 0.01 },
        distortion: {value:0.1, min: 0, max: 1, step: 0.01 },
        distortionScale: {value:0.1, min: 0, max: 1, step: 0.01 },
        temporalDistortion: {value:0.2, min: 0, max: 1, step: 0.01 },
        iridescence: {value:1, min: 0, max: 1, step: 0.01 },
        iridescenceIOR: {value:1, min: 0, max: 1, step: 0.01 },
        iridescenceThicknessRange: {value:[0,1400], min: 0, max: 1400, step: 1 },
        attenuationColor: {value:'#ffffff'},
        color: {value:'#ffffff'},
    });

  
    useLayoutEffect(() => {
      // Apply stencil to all contents
      ref.current.traverse((child:THREE.Mesh) => child.material && Object.assign(child.material, { ...stencil }))
    }, [])
    return (
      <>
      {/* <group {...props} dispose={null}> */}
        <mesh castShadow  {...props} geometry={nodes.Cube.geometry}>
          <MeshTransmissionMaterial
            samples={samples}
            thickness={thickness}
            roughness={roughness}
            ior={ior}
            chromaticAberration={chromaticAberration}
            anisotropy={anisotropy}
            distortion={distortion}
            distortionScale={distortionScale?distortionScale:0}
            temporalDistortion={temporalDistortion?temporalDistortion:0}
            iridescence={iridescence}
            iridescenceIOR={iridescenceIOR}
            iridescenceThicknessRange={iridescenceThicknessRange}
            attenuationColor={attenuationColor}
            color={color}
          />
        </mesh>
        <group ref={ref}>{children}</group>
      {/* </group> */}
      </>
    )
}