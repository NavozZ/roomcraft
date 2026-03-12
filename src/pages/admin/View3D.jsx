import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as THREE from 'three'
import Navbar from '../../components/layout/Navbar'
import { useDesign } from '../../hooks/useDesign'
import { designService } from '../../services/designService'


function Room3D({ room }) {
  const { widthM, heightM, wallColour, floorColour } = room
  const wallH = 2.8   
  const wallT = 0.08 

  const floorMat  = new THREE.MeshStandardMaterial({ color: floorColour || '#C8A882', roughness: 0.8, metalness: 0.05 })
  const wallMat   = new THREE.MeshStandardMaterial({ color: wallColour  || '#FAF7F2', roughness: 0.9, metalness: 0 })

  return (
    <group>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[widthM / 2, 0, heightM / 2]} receiveShadow>
        <planeGeometry args={[widthM, heightM]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[widthM / 2, wallH, heightM / 2]}>
        <planeGeometry args={[widthM, heightM]} />
        <meshStandardMaterial color="#f5f5f0" roughness={1} />
      </mesh>

      
      <mesh position={[widthM / 2, wallH / 2, 0]} receiveShadow>
        <boxGeometry args={[widthM, wallH, wallT]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      
      <mesh position={[widthM / 2, wallH / 2, heightM]}>
        <boxGeometry args={[widthM, wallH, wallT]} />
        <meshStandardMaterial color={wallColour || '#FAF7F2'} transparent opacity={0.15} roughness={0.9} />
      </mesh>

      
      <mesh position={[0, wallH / 2, heightM / 2]} receiveShadow>
        <boxGeometry args={[wallT, wallH, heightM]} />
        <primitive object={wallMat.clone()} attach="material" />
      </mesh>

      
      <mesh position={[widthM, wallH / 2, heightM / 2]} receiveShadow>
        <boxGeometry args={[wallT, wallH, heightM]} />
        <primitive object={wallMat.clone()} attach="material" />
      </mesh>

      
      {[
        [widthM / 2, 0.05, 0.02],
        [widthM / 2, 0.05, heightM - 0.02],
        [0.02,       0.05, heightM / 2],
        [widthM - 0.02, 0.05, heightM / 2],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[
            i < 2 ? widthM : wallT * 1.5,
            0.1,
            i < 2 ? wallT * 1.5 : heightM,
          ]} />
          <meshStandardMaterial color="#D4C4B0" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

//Furniture box 
function FurnitureBox({ item }) {
  const meshRef  = useRef()
  const [hovered, setHovered] = useState(false)

  // Gentle hover pulse
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y, hovered ? 1.03 : 1, 0.1
      )
    }
  })

  const colour  = item.colour  || '#C8A882'
  const shading = item.shading || 0
  const boxH    = item.type === 'bed' ? 0.55
                : item.type === 'sofa' || item.type === 'chair' ? 0.75
                : item.type === 'wardrobe' ? 1.9
                : item.type === 'bookshelf' ? 1.6
                : item.type === 'tv-stand'  ? 0.5
                : 0.75

  //x and y from 2D canvas
  const posX = item.x + item.widthM / 2
  const posZ = item.y + item.depthM / 2
  const posY = boxH / 2

  const rotY = ((item.rotation || 0) * Math.PI) / 180

  
  const c = new THREE.Color(colour)
  c.multiplyScalar(1 - shading * 0.4)

  return (
    <group position={[posX, posY, posZ]} rotation={[0, -rotY, 0]}>
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[item.widthM, boxH, item.depthM]} />
        <meshStandardMaterial
          color={c}
          roughness={0.7}
          metalness={0.05}
          emissive={hovered ? new THREE.Color('#ffffff') : new THREE.Color('#000000')}
          emissiveIntensity={hovered ? 0.04 : 0}
        />
      </mesh>

      
      <Text
        position={[0, boxH / 2 + 0.15, 0]}
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


function Lighting({ room }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      
      <pointLight
        position={[room.widthM / 2, 2.4, room.heightM / 2]}
        intensity={40}
        distance={12}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      <pointLight
        position={[room.widthM * 0.2, 2.2, room.heightM * 0.8]}
        intensity={15}
        distance={8}
        color="#fff8f0"
      />
      <directionalLight position={[5, 8, 5]} intensity={0.4} castShadow />
    </>
  )
}


function SceneCamera({ room }) {
  const dist = Math.max(room.widthM, room.heightM) * 1.3
  return (
    <PerspectiveCamera
      makeDefault
      position={[room.widthM / 2, dist * 0.7, room.heightM + dist * 0.6]}
      fov={50}
    />
  )
}

//Main Page
export default function View3D() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { currentDesign, loadDesign } = useDesign()
  const [shadows, setShadows] = useState(true)
  const [wireframe, setWireframe] = useState(false)

  useEffect(() => {
    if (!currentDesign || currentDesign.id !== id) {
      const saved = designService.getById(id)
      if (saved) loadDesign(saved)
      else navigate('/admin')
    }
  }, [id])

  if (!currentDesign) {
    return (
      <div className="min-h-screen bg-wood-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-wood-600 border-t-wood-400 rounded-full animate-spin" />
      </div>
    )
  }

  const { room, furniture } = currentDesign

  return (
    <div className="min-h-screen bg-wood-900 flex flex-col">
      <Navbar />

      <div className="pt-16 flex flex-col flex-1">

        
        <div className="h-12 bg-wood-800 border-b border-wood-700 flex items-center px-4 gap-4 flex-shrink-0">
          <Link to={`/admin/editor/${id}`} className="btn btn-secondary btn-sm">
            ← 2D Editor
          </Link>
          <span className="text-wood-600">·</span>
          <span className="font-display text-wood-200 text-sm">{room.name}</span>
          <span className="text-wood-600">·</span>
          <span className="text-xs text-wood-400">{room.widthM}m × {room.heightM}m · {furniture.length} items</span>

          <div className="flex-1" />

          
          <label className="flex items-center gap-2 text-xs text-wood-400 cursor-pointer">
            <input type="checkbox" checked={shadows} onChange={e => setShadows(e.target.checked)}
              className="accent-wood-500" />
            Shadows
          </label>
          <label className="flex items-center gap-2 text-xs text-wood-400 cursor-pointer">
            <input type="checkbox" checked={wireframe} onChange={e => setWireframe(e.target.checked)}
              className="accent-wood-500" />
            Wireframe
          </label>

          <Link to="/admin" className="btn btn-ghost btn-sm text-wood-400">
            Dashboard
          </Link>
        </div>

        
        <div className="bg-wood-700/50 px-4 py-1.5 flex items-center gap-6">
          <span className="text-xs text-wood-400">🖱️ Left drag — rotate</span>
          <span className="text-xs text-wood-400">🖱️ Right drag — pan</span>
          <span className="text-xs text-wood-400">🖱️ Scroll — zoom</span>
          <span className="text-xs text-wood-400">Hover furniture to highlight</span>
        </div>

        
        <div className="flex-1">
          <Canvas
            shadows={shadows}
            gl={{ antialias: true }}
            style={{ background: '#1C1006' }}
          >
            <SceneCamera room={room} />
            <Lighting room={room} />

            <Suspense fallback={null}>
              <Room3D room={room} />
              {furniture.map(item => (
                <FurnitureBox key={item.id} item={item} wireframe={wireframe} />
              ))}
            </Suspense>

            <OrbitControls
              target={[room.widthM / 2, 0.8, room.heightM / 2]}
              minDistance={1}
              maxDistance={Math.max(room.widthM, room.heightM) * 3}
              maxPolarAngle={Math.PI / 2.05}
              enableDamping
              dampingFactor={0.06}
            />
          </Canvas>
        </div>

        
        <div className="h-10 bg-wood-800 border-t border-wood-700 flex items-center px-4 gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: room.floorColour }} />
            <span className="text-xs text-wood-400">Floor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: room.wallColour }} />
            <span className="text-xs text-wood-400">Walls</span>
          </div>
          <span className="text-xs text-wood-500">·</span>
          <span className="text-xs text-wood-400">{furniture.length} furniture items placed</span>
          <span className="text-xs text-wood-500">·</span>
          <span className="text-xs text-wood-400">Area: {(room.widthM * room.heightM).toFixed(1)} m²</span>
        </div>
      </div>
    </div>
  )
}
