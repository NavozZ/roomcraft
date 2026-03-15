export const FURNITURE_CATALOGUE = [
  { type: 'sofa',          label: 'Sofa',          icon: '🛋️', widthM: 2.2, depthM: 0.9, colour: '#C8A882', modelFile: 'sofa.glb' },
  { type: 'dining-table',  label: 'Dining Table',  icon: '🪑', widthM: 1.8, depthM: 0.9, colour: '#A67C52', modelFile: 'dining-table.glb' },
  { type: 'chair',         label: 'Chair',         icon: '🪑', widthM: 0.6, depthM: 0.6, colour: '#A67C52', modelFile: 'chair.glb' },
  { type: 'bed',           label: 'Bed',           icon: '🛏️', widthM: 1.6, depthM: 2.0, colour: '#D4C4B0', modelFile: 'bed.glb' },
  { type: 'wardrobe',      label: 'Wardrobe',      icon: '🚪', widthM: 1.8, depthM: 0.6, colour: '#7A5230', modelFile: 'wardrobe.glb' },
  { type: 'bookshelf',     label: 'Bookshelf',     icon: '📚', widthM: 1.0, depthM: 0.3, colour: '#8B6340', modelFile: 'bookshelf.glb' },
  { type: 'coffee-table',  label: 'Coffee Table',  icon: '🪵', widthM: 1.2, depthM: 0.6, colour: '#B8956A', modelFile: 'coffee-table.glb' },
  { type: 'tv-stand',      label: 'TV Stand',      icon: '📺', widthM: 1.5, depthM: 0.4, colour: '#5C3D1E', modelFile: 'tv-stand.glb' },
  { type: 'side-table',    label: 'Side Table',    icon: '🪵', widthM: 0.5, depthM: 0.5, colour: '#C8A882', modelFile: 'side-table.glb' },
  { type: 'desk',          label: 'Desk',          icon: '🖥️', widthM: 1.4, depthM: 0.7, colour: '#A67C52', modelFile: 'desk.glb' },
]

export const getFurnitureByType = (type) =>
  FURNITURE_CATALOGUE.find(f => f.type === type) || null
