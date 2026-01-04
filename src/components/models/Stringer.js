import React, { forwardRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import * as THREE from 'three'
import modelUrl from './stringer1-transformed.glb'
import textureUrl from '../../assets/lycra_texture.png' // Asegúrate que la ruta sea correcta
import state from '../../store'

export const Stringer = forwardRef((props, ref) => {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF(modelUrl)
  
  // Cargamos la textura
  const lycraTexture = useTexture(textureUrl)

  // Configuramos el patrón para que sea microfibra fina
  lycraTexture.wrapS = lycraTexture.wrapT = THREE.RepeatWrapping
  lycraTexture.repeat.set(16, 16) 

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* TELA PRINCIPAL - EFECTO MATE CON TEXTURA PLANA */}
      <mesh 
        geometry={nodes.extra_clothing_mesh.geometry} 
        position={[0, 1.024, 0.049]} 
        rotation={[Math.PI / 2, 0, 0]} 
        scale={[0.561, 0.571, 0.51]}
      >
        <meshPhysicalMaterial
          color={snap.color}
          map={lycraTexture}    // Aplicamos la textura visualmente
          roughness={0.9}       // Acabado mate
          metalness={0.3}         // Sin reflejos metálicos
          clearcoat={0}         // Eliminamos el brillo tipo barniz
        />
      </mesh>

      {/* LOGOS Y DETALLES */}
      <mesh geometry={nodes.logo_mesh_2.geometry} material={materials['Acros (3)']} position={[0, 1.85, -0.143]} rotation={[Math.PI / 2, 0, -3.13]} scale={0.066} />
      <mesh geometry={nodes.logo_mesh_1.geometry} material={materials.logo} position={[0.111, 1.708, 0.272]} rotation={[1.13, 0.015, -0.035]} scale={0.091} />
      <mesh geometry={nodes.Puntada006_material_Shader3355536_0.geometry} material={materials.material_Shader3355536} position={[0.154, 111.656, -13.685]} rotation={[2.252, -0.018, 3.137]} />
    </group>
  )
})

// Es buena práctica pre-cargar ambos recursos
useGLTF.preload(modelUrl)