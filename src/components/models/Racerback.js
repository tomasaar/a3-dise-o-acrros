import React, { forwardRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import * as THREE from 'three'
import modelUrl from './racerback-transformed.glb'
import textureUrl from '../../assets/lycra_texture.png'
import state from '../../store'

export const Racerback = forwardRef((props, ref) => {
  const snap = useSnapshot(state)
  const { nodes, materials } = useGLTF(modelUrl)
  
  // Cargamos la textura de lycra
  const lycraTexture = useTexture(textureUrl)

  // Mantenemos el tiling en 16 para consistencia visual con los otros modelos
  lycraTexture.wrapS = lycraTexture.wrapT = THREE.RepeatWrapping
  lycraTexture.repeat.set(16, 16) 

  return (
    <group ref={ref} {...props} dispose={null}>
      {/* TELA PRINCIPAL - ACABADO DEPORTIVO MATE */}
      <mesh 
        geometry={nodes.extra_clothing_mesh.geometry} 
        position={[0, 1.110, 0.05]} 
        rotation={[Math.PI / 2, 0, 0]} 
        scale={[0.507, 0.667, 0.457]}
      >
        <meshPhysicalMaterial 
          color={snap.color}
          map={lycraTexture}    // Textura visual sin relieve
          roughness={0.9}       // Suavidad de tela mate
          metalness={0.3}         // Sin reflejos metálicos
          clearcoat={0}         // Sin capa de brillo sintético
        />
      </mesh>

      {/* LOGOS */}
      <mesh geometry={nodes.logo_mesh_1.geometry} material={materials.logo} position={[0.137, 1.700, 0.371]} rotation={[Math.PI / 2, 0, -0.279]} scale={0.105} />
      <mesh geometry={nodes.logo_mesh_2.geometry} material={materials['Acros (3)']} position={[0, 1.818, -0.19]} rotation={[1.581, -0.025, -3.111]} scale={0.083} />
    </group>
  )
})

useGLTF.preload(modelUrl)