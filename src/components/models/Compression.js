import React, { forwardRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import * as THREE from 'three'
import modelUrl from '../../assets/compression1.glb'
import textureUrl from '../../assets/lycra_texture.png'
import state from '../../store'

export const Compression = forwardRef((props, ref) => {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF(modelUrl)
  
  const lycraTexture = useTexture(textureUrl)

  // Aumentamos la repetición (tiling) para que se vea la trama fina y no arrugas
  // Un valor de 16 o 20 hará que el poro de la tela sea muy pequeño y realista
  lycraTexture.wrapS = lycraTexture.wrapT = THREE.RepeatWrapping
  lycraTexture.repeat.set(16, 16) 

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* TELA PRINCIPAL - TEXTURA PLANA */}
      <mesh 
        castShadow 
        geometry={nodes.extra_clothing_mesh.geometry} 
        position={[-0.004, 1.095, 0.06]} 
        rotation={[Math.PI / 2, 0, 0]} 
        scale={[0.535, 0.699, 0.475]}
      >
        <meshPhysicalMaterial
          color={snap.color}
          map={lycraTexture} // La textura se aplica como patrón visual
          roughness={0.9}    // Un poco más mate para que no brille como plástico
          metalness={0.2}      // Cero metalizado para efecto tela
          clearcoat={0}      // Quitamos el clearcoat para eliminar el brillo de "cuero/látex"
          transparent={false}
        />
      </mesh>

      {/* LOGOS Y PUNTADAS */}
      <mesh castShadow geometry={nodes.logo_mesh_1.geometry} material={materials.logo} position={[0.151, 1.717, 0.263]} rotation={[0.951, 0.021, -0.005]} scale={0.11} />
      <mesh castShadow geometry={nodes.logo_mesh_2.geometry} material={materials['Acros (3)']} position={[0, 1.888, -0.18]} rotation={[1.685, 0, -3.097]} scale={0.082} />
      <mesh castShadow geometry={nodes.Puntada006_material_Shader3355536_0.geometry} material={materials.material_Shader3355536} position={[0.154, 111.656, -13.685]} rotation={[2.252, -0.018, 3.137]} />
    </group>
  )
})

useGLTF.preload(modelUrl)