import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Text } from '@react-three/drei'
import * as THREE from 'three'

// Model heights per type
const BOX_HEIGHTS = {
  'bed':          0.55,
  'sofa':         0.80,
  'chair':        0.85,
  'wardrobe':     1.90,
  'bookshelf':    1.60,
  'tv-stand':     0.50,
  'coffee-table': 0.45,
  'dining-table': 0.75,
  'side-table':   0.60,
  'desk':         0.75,
}

//  GLB model loader
function GLBModel({ url, item, hovered }) {
  const { scene } = useGLTF(url)

  
  const cloned = useMemo(() => {
    const clone = scene.clone(true)

    
    const box  = new THREE.Box3().setFromObject(clone)
    const size = new THREE.Vector3()
    box.getSize(size)

    
    if (size.x > 0 && size.z > 0) {
      const scale = Math.min(item.widthM / size.x, item.depthM / size.z)
      clone.scale.set(scale, scale, scale)
    }

    
    const scaledBox = new THREE.Box3().setFromObject(clone)
    clone.position.y = -scaledBox.min.y

    
    const centre = new THREE.Vector3()
    scaledBox.getCenter(centre)
    clone.position.x = -centre.x
    clone.position.z = -centre.z

    
    const colour = new THREE.Color(item.colour || '#C8A882')
    colour.multiplyScalar(1 - (item.shading || 0) * 0.4)
    clone.traverse(child => {
      if (child.isMesh) {
        child.castShadow    = true
        child.receiveShadow = true
        child.material      = child.material.clone()
        child.material.color.lerp(colour, 0.35)
        child.material.emissive          = new THREE.Color(hovered ? '#ffffff' : '#000000')
        child.material.emissiveIntensity = hovered ? 0.04 : 0
      }
    })

    return clone
  }, [scene, item, hovered])

  return <primitive object={cloned} />
}

// Fallback styled box
function FallbackBox({ item, hovered }) {
  const meshRef = useRef()
  const boxH = BOX_HEIGHTS[item.type] || 0.75

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y, hovered ? 1.04 : 1, 0.1
      )
    }
  })

  const c = new THREE.Color(item.colour || '#C8A882')
  c.multiplyScalar(1 - (item.shading || 0) * 0.4)

  return (
    
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      position={[0, boxH / 2, 0]}
    >
      <boxGeometry args={[item.widthM, boxH, item.depthM]} />
      <meshStandardMaterial
        color={c}
        roughness={0.65}
        metalness={0.05}
        emissive={hovered ? new THREE.Color('#ffffff') : new THREE.Color('#000000')}
        emissiveIntensity={hovered ? 0.05 : 0}
      />
    </mesh>
  )
}

// GLB loader with error boundary 
function GLBWithFallback({ item, hovered }) {
  const [hasModel, setHasModel] = useState(true)
  const modelPath = `/models/${item.type}.glb`

  
  useEffect(() => {
    fetch(modelPath, { method: 'HEAD' })
      .then(res => { if (!res.ok) setHasModel(false) })
      .catch(() => setHasModel(false))
  }, [modelPath])

  if (!hasModel) {
    return <FallbackBox item={item} hovered={hovered} />
  }

  return (
    <Suspense fallback={<FallbackBox item={item} hovered={hovered} />}>
      <GLBModel url={modelPath} item={item} hovered={hovered} />
    </Suspense>
  )
}

//Main exported component 
export default function FurnitureModel({ item }) {
  const [hovered, setHovered] = useState(false)

  const posX = item.x + item.widthM / 2
  const posZ = item.y + item.depthM / 2
  const boxH = BOX_HEIGHTS[item.type] || 0.75
  const rotY = ((item.rotation || 0) * Math.PI) / 180

  return (
    <group
      position={[posX, 0, posZ]}
      rotation={[0, -rotY, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <GLBWithFallback item={item} hovered={hovered} />

      
      <Text
        position={[0, boxH + 0.2, 0]}
        fontSize={0.13}
        color="#4A2F12"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
      >
        {item.label}
      </Text>
    </group>
  )
}
