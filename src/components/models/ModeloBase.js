// src/components/models/ModeloBase.js
import React, { forwardRef } from 'react'
import modelUrl from './modelo1-transformed.glb'
import { useGLTF } from '@react-three/drei'

export const ModeloBase = forwardRef((props, ref) => {
  const { nodes } = useGLTF(modelUrl)
  
  return (
    <group ref={ref} {...props} dispose={null}>
      {/* CUERPO PRINCIPAL - Quitamos el position interno para que no flote */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Puntada00670_material_Shader3355536_0.geometry}
      >
        <meshStandardMaterial color="#000000ff" roughness={0.8} />
      </mesh>

      {/* CABEZA / DETALLES - Si ves que la cabeza flota, es porque el GLB tiene un offset */}
      <mesh
        castShadow
        geometry={nodes.Object_2.geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.057}
      >
        <meshStandardMaterial color="white" roughness={0.345} metalness={1}/>
      </mesh>

      {/* SHORTS - Ajustamos la escala para que NO toque la piel (evita manchas) */}
      <mesh
        castShadow
        geometry={nodes.Object_4001.geometry}
        position={[0, -0.16, 0.039]} 
        // Escala ligeramente mayor para evitar el parpadeo (Z-fighting)
        scale={[1.411, 1.19, 1.739]}
      >
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>
    </group>
  )
})

useGLTF.preload(modelUrl)