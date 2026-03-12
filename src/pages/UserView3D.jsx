import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as THREE from 'three'
import Navbar from '../../components/layout/Navbar'
import { useDesign } from '../../hooks/useDesign'
import { designService } from '../../services/designService'



function Room3D({ room }) {
  const { widthM, heightM, wallColour, floorColour } = room
  const wallH = 2.8, wallT = 0.08
  const floorMat = new THREE.MeshStandardMaterial({ color: floorColour || '#C8A882', roughness: 0.8 })
  const wallMat  = new THREE.MeshStandardMaterial({ color: wallColour  || '#FAF7F2', roughness: 0.9 })
  return (
    <group>
      <mesh rotation={[-Math.PI/2,0,0]} position={[widthM/2,0,heightM/2]} receiveShadow>
        <planeGeometry args={[widthM,heightM]} />
        <primitive object={floorMat} attach="material" />
      </mesh>
      <mesh position={[widthM/2,wallH/2,0]} receiveShadow>
        <boxGeometry args={[widthM,wallH,wallT]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      <mesh position={[widthM/2,wallH/2,heightM]}>
        <boxGeometry args={[widthM,wallH,wallT]} />
        <meshStandardMaterial color={wallColour||'#FAF7F2'} transparent opacity={0.12} />
      </mesh>
      <mesh position={[0,wallH/2,heightM/2]} receiveShadow>
        <boxGeometry args={[wallT,wallH,heightM]} />
        <primitive object={wallMat.clone()} attach="material" />
      </mesh>
      <mesh position={[widthM,wallH/2,heightM/2]} receiveShadow>
        <boxGeometry args={[wallT,wallH,heightM]} />
        <primitive object={wallMat.clone()} attach="material" />
      </mesh>
    </group>
  )
}

function FurnitureBox({ item }) {
  const boxH = item.type==='wardrobe'?1.9:item.type==='bookshelf'?1.6:item.type==='bed'?0.55:0.75
  const c = new THREE.Color(item.colour||'#C8A882')
  c.multiplyScalar(1-(item.shading||0)*0.4)
  const rotY = ((item.rotation||0)*Math.PI)/180
  return (
    <group position={[item.x+item.widthM/2, boxH/2, item.y+item.depthM/2]} rotation={[0,-rotY,0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[item.widthM, boxH, item.depthM]} />
        <meshStandardMaterial color={c} roughness={0.7} metalness={0.05} />
      </mesh>
      <Text position={[0,boxH/2+0.15,0]} fontSize={0.12} color="#4A2F12" anchorX="center" anchorY="middle">
        {item.label}
      </Text>
    </group>
  )
}

export default function UserView3D() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { currentDesign, loadDesign } = useDesign()

  useEffect(() => {
    if (!currentDesign || currentDesign.id !== id) {
      const saved = designService.getById(id)
      if (saved) loadDesign(saved)
      else navigate('/user')
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
  const dist = Math.max(room.widthM, room.heightM) * 1.3

  return (
    <div className="min-h-screen bg-wood-900 flex flex-col">
      <Navbar />
      <div className="pt-16 flex flex-col flex-1">

        <div className="h-12 bg-wood-800 border-b border-wood-700 flex items-center px-4 gap-4">
          <Link to="/user" className="btn btn-secondary btn-sm">← My Room</Link>
          <span className="text-wood-600">·</span>
          <span className="font-display text-wood-200 text-sm">{room.name}</span>
          <span className="text-wood-600">·</span>
          <span className="text-xs text-wood-400">{furniture.length} furniture pieces</span>
        </div>

        <div className="bg-wood-700/40 px-4 py-1.5 flex items-center gap-6">
          <span className="text-xs text-wood-400">🖱️ Drag to rotate · Scroll to zoom · Right-drag to pan</span>
        </div>

        <div className="flex-1">
          <Canvas shadows gl={{ antialias: true }} style={{ background: '#1C1006' }}>
            <PerspectiveCamera makeDefault
              position={[room.widthM/2, dist*0.7, room.heightM+dist*0.6]}
              fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[room.widthM/2,2.4,room.heightM/2]} intensity={40} distance={12} castShadow />
            <pointLight position={[room.widthM*0.2,2.2,room.heightM*0.8]} intensity={15} distance={8} color="#fff8f0" />
            <Suspense fallback={null}>
              <Room3D room={room} />
              {furniture.map(item => <FurnitureBox key={item.id} item={item} />)}
            </Suspense>
            <OrbitControls
              target={[room.widthM/2, 0.8, room.heightM/2]}
              minDistance={1}
              maxDistance={Math.max(room.widthM,room.heightM)*3}
              maxPolarAngle={Math.PI/2.05}
              enableDamping dampingFactor={0.06}
            />
          </Canvas>
        </div>
      </div>
    </div>
  )
}
