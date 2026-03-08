import { createContext, useState } from 'react'

export const DesignContext = createContext(null)

export function DesignProvider({ children }) {
  const [currentDesign, setCurrentDesign] = useState(null)

  const createDesign = (room) => {
    const design = {
      id: Date.now().toString(),
      name: `${room.name} Design`,
      room,
      furniture: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCurrentDesign(design)
    return design
  }

  const loadDesign   = (design) => setCurrentDesign(design)
  const clearDesign  = ()       => setCurrentDesign(null)

  const addFurniture = (item) => {
    setCurrentDesign(prev => ({
      ...prev,
      furniture: [...prev.furniture, {
        id: Date.now().toString(), x: 1, y: 1,
        rotation: 0, colour: '#C8A882', shading: 0.5, ...item,
      }],
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateFurniture = (id, changes) => {
    setCurrentDesign(prev => ({
      ...prev,
      furniture: prev.furniture.map(f => f.id === id ? { ...f, ...changes } : f),
      updatedAt: new Date().toISOString(),
    }))
  }

  const removeFurniture = (id) => {
    setCurrentDesign(prev => ({
      ...prev,
      furniture: prev.furniture.filter(f => f.id !== id),
      updatedAt: new Date().toISOString(),
    }))
  }

  const updateRoom = (changes) => {
    setCurrentDesign(prev => ({
      ...prev,
      room: { ...prev.room, ...changes },
      updatedAt: new Date().toISOString(),
    }))
  }

  return (
    <DesignContext.Provider value={{
      currentDesign, createDesign, loadDesign,
      addFurniture, updateFurniture, removeFurniture,
      updateRoom, clearDesign,
    }}>
      {children}
    </DesignContext.Provider>
  )
}