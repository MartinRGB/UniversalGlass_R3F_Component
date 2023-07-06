import { UniversalGlassMaterial } from "@/UniversalGlass/UniversalGlass"
import { useGLTF, useMask } from "@react-three/drei"
import { useControls } from "leva"
import { useLayoutEffect, useRef } from "react"

export const UniversalGlassContainer = ({ 
    // normalScale,
    // overlayColor,
    // overlayFactor,
    // refractionRatio,
    // reflectionRatio,
    // reflectivity,
    // blurRadius,
    // LODLevel,
    // roughness,
    // fresnelBias,
    // fresnelPower,
    // fresnelScale,
    // cubeMapRenderTargetSize, 
    levaName,
    normalMap,
    children,
    ...props
}:{
    // normalScale?:number,
    // overlayColor?:THREE.ColorRepresentation,
    // overlayFactor?:number,
    // refractionRatio?:number,
    // reflectionRatio?:number,
    // reflectivity?:number,
    // blurRadius?:number,
    // LODLevel?:number,
    // roughness?:number,
    // fresnelBias?:number,
    // fresnelPower?:number,
    // fresnelScale?:number,
    // cubeMapRenderTargetSize?:number
    levaName?:string
    normalMap?:THREE.Texture,
    children?:React.ReactNode
} ) => {
    const ref = useRef<any>()
    const { nodes }:any = useGLTF('./glass/shapes-transformed.glb')
    const stencil = useMask(1, false)
    useLayoutEffect(() => {
      // Apply stencil to all contents
      ref.current.traverse((child:THREE.Mesh) => child.material && Object.assign(child.material, { ...stencil }))
    }, [])

    const {
        normalScale,
        overlayColor,
        overlayFactor,
        refractionRatio,
        reflectionRatio,
        reflectivity,
        blurRadius,
        LODLevel,
        universal_roughness,
        fresnelBias,
        fresnelPower,
        fresnelScale,
      } = useControls(levaName?levaName:'Universal Glass',{
          normalScale: {value:0, min: 0, max: 10, step: 0.01 },
          overlayColor: {value:'#ffffff'},
          overlayFactor: {value:0, min: 0, max: 1, step: 0.01 },
          refractionRatio: {value:0.985, min: 0.925, max: 1.05, step: 0.001 }, // 0 - 0.2 or 0.93 ~ 1.08
          reflectionRatio: {value:0.2, min: 0.01, max: 1, step: 0.01 },
          reflectivity: {value:1, min: 0, max: 1, step: 0.01 },
          blurRadius: {value:0.5, min: 0.1, max: 3, step: 0.01 },
          LODLevel: {value:0.0, min: 0, max: 16, step: 1 },
          universal_roughness: {value:0.0, min: 0, max: 1, step: 0.01,label:'roughness'},
          fresnelBias: {value:0.1, min: 0, max: 1, step: 0.01 },
          fresnelPower: {value:1., min: 0, max: 10, step: 0.01 },
          fresnelScale: {value:1., min: 0, max: 10, step: 0.01 },
      });
      
    return (
    <>
        <mesh castShadow {...props} geometry={nodes.Cube.geometry}>

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
                        roughness={universal_roughness}
                        fresnelBias={fresnelBias}
                        fresnelPower={fresnelPower}
                        fresnelScale={fresnelScale}
                    />
        </mesh>
        <group ref={ref}>{children}</group>
    </>
    )
}