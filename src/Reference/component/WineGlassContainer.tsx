import { UniversalGlassMaterial } from "@/UniversalGlass/UniversalGlass"
import { useGLTF, useMask } from "@react-three/drei"
import { useLayoutEffect, useRef } from "react"

export const WineGlassContainer = ({ 
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
   
    normalMap,
    children,
    ...props
}:{
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
   
    normalMap?:THREE.Texture,
    children?:React.ReactNode
} ) =>{

    const ref = useRef<any>()
    const { nodes }:any = useGLTF('./glass/wine_glass.glb')
    const stencil = useMask(1, false)

    useLayoutEffect(() => {
      // Apply stencil to all contents
      ref.current.traverse((child:THREE.Mesh) => child.material && Object.assign(child.material, { ...stencil }))
    }, [])



      return (
        <>
            <mesh castShadow {...props} geometry={nodes.Wine_glass_Glass_0.geometry}>
    
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
            </mesh>
            <group ref={ref}>{children}</group>
        </>
        )
}