import * as React from "react";
import { useControls } from "leva";
import { TransmissionGlassContainer } from "./component/TransmissionGlassContainer";
import { AquariumInside, AquariumSceneTemplate } from "./component/AquariumSceneTemplate";
import { UniversalGlassContainer } from "./component/UniversalGlassContainer";
import { UniversalGlassRenderController } from "@/UniversalGlass/UniversalGlass";
import { Box } from "@react-three/drei";

  
export const GlassAquariumScene = () => {

  const {isUniversalGlass} = useControls('Glass Switcher',{
    isUniversalGlass: {value:false},
  })


  return (
    <>
      <AquariumSceneTemplate>
        {isUniversalGlass?
        <>
        <UniversalGlassRenderController>
            <UniversalGlassContainer 
            position={[0, 0.25, 0]}
            scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
            normalMap={null}
            // normalScale={normalScale}
            // overlayColor={overlayColor}
            // overlayFactor={overlayFactor}
            // refractionRatio={refractionRatio}
            // reflectionRatio={reflectionRatio}
            // reflectivity={reflectivity}
            // blurRadius={blurRadius}
            // LODLevel={LODLevel}
            // roughness={universal_roughness}
            // fresnelBias={fresnelBias}
            // fresnelPower={fresnelPower}
            // fresnelScale={fresnelScale}
            >
              <AquariumInside/>
            </UniversalGlassContainer>

            <UniversalGlassContainer 
              position={[20, 0.25, -4]}
              scale={[0.61 * 6, 0.8 * 6, 1 * 6]}
              normalMap={null}
            // normalScale={normalScale}
            // overlayColor={overlayColor}
            // overlayFactor={overlayFactor}
            // refractionRatio={refractionRatio}
            // reflectionRatio={reflectionRatio}
            // reflectivity={reflectivity}
            // blurRadius={blurRadius}
            // LODLevel={LODLevel}
            // roughness={universal_roughness}
            // fresnelBias={fresnelBias}
            // fresnelPower={fresnelPower}
            // fresnelScale={fresnelScale}
            >
              <Box args={[2,2,2]} position={[20,-2,-2]}>
              <meshPhongMaterial color={'blue'} />
              </Box>

              <Box args={[2,2,2]} position={[20,4,-6]}>
              <meshPhongMaterial color={'red'} />
              </Box>

              <Box args={[2,2,2]} position={[20,2,0]}>
              <meshPhongMaterial color={'green'} />
              </Box>
            </UniversalGlassContainer>
        </UniversalGlassRenderController>


        </>
        :
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
        }

      </AquariumSceneTemplate>
    </>
  )
}
