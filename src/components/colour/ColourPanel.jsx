const PALETTES = [
  {
    name: 'Wood Tones',
    colours: ['#C8A882','#A67C52','#7A5230','#4A2F12','#B8956A','#D4C4B0','#8B6340','#5C3D1E'],
  },
  {
    name: 'Neutrals',
    colours: ['#FFFFFF','#F5F5F5','#DDDDDD','#BBBBBB','#888888','#555555','#333333','#111111'],
  },
  {
    name: 'Pastels',
    colours: ['#A0B4C8','#A0C8A0','#C8A0A0','#C8C8A0','#B0A0C8','#A0C0C8','#C8B0A0','#C0C8A0'],
  },
  {
    name: 'Bold',
    colours: ['#C0392B','#E67E22','#F1C40F','#27AE60','#2980B9','#8E44AD','#2C3E50','#16A085'],
  },
]

// Wall colour presets
const WALL_PRESETS = [
  { label: 'White',      value: '#FFFFFF' },
  { label: 'Cream',      value: '#FAF7F2' },
  { label: 'Warm Grey',  value: '#D8D0C8' },
  { label: 'Sage',       value: '#B8C8B0' },
  { label: 'Sky Blue',   value: '#B0C8D8' },
  { label: 'Blush',      value: '#D8B8B8' },
  { label: 'Olive',      value: '#C8C8A0' },
  { label: 'Charcoal',   value: '#4A4A4A' },
]

// Floor colour presets
const FLOOR_PRESETS = [
  { label: 'Oak',    value: '#C8A882' },
  { label: 'Walnut', value: '#7A5230' },
  { label: 'Carpet', value: '#C8C0B8' },
  { label: 'Marble', value: '#E8E8E8' },
  { label: 'Tile',   value: '#D0D8E0' },
]


function ShadingPreview({ colour, shading }) {
  
  return (
    <div className="flex gap-1 mt-1">
      {[0, 0.25, 0.5, 0.75, 1].map(s => {
        const opacity = 1 - s * 0.6
        const isActive = Math.abs(s - shading) < 0.15
        return (
          <div
            key={s}
            className={`flex-1 h-4 rounded transition-all ${isActive ? 'ring-2 ring-blue-400 scale-y-125' : ''}`}
            style={{ background: colour, opacity }}
            title={`${Math.round(s * 100)}% shading`}
          />
        )
      })}
    </div>
  )
}


export default function ColourPanel({ selectedItem, onUpdateFurniture, room, onUpdateRoom }) {
  const hasItem = !!selectedItem

  return (
    <div className="flex flex-col gap-0 overflow-y-auto flex-1">

      
      <div className="px-4 py-3 border-b border-wood-700">
        <p className="text-xs text-wood-400 uppercase tracking-widest font-medium">
          {hasItem ? `${selectedItem.label} — Colour` : 'Furniture Colour'}
        </p>
      </div>

      {hasItem ? (
        <div className="p-4 flex flex-col gap-5">

          
          {PALETTES.map(palette => (
            <div key={palette.name}>
              <p className="text-2xs text-wood-500 uppercase tracking-wider mb-2 font-medium">{palette.name}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {palette.colours.map(c => (
                  <button
                    key={c}
                    onClick={() => onUpdateFurniture(selectedItem.id, { colour: c })}
                    className={`w-full aspect-square rounded transition-all
                      ${selectedItem.colour === c
                        ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-wood-800 scale-110'
                        : 'hover:scale-105 hover:ring-1 hover:ring-wood-500'}`}
                    style={{ background: c, border: '1px solid rgba(255,255,255,0.1)' }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          ))}

          
          <div>
            <p className="text-2xs text-wood-500 uppercase tracking-wider mb-2 font-medium">Custom Colour</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded flex-shrink-0 border border-wood-600"
                style={{ background: selectedItem.colour }} />
              <input
                type="color"
                value={selectedItem.colour}
                onChange={e => onUpdateFurniture(selectedItem.id, { colour: e.target.value })}
                className="flex-1 h-8 rounded cursor-pointer border border-wood-600 bg-transparent"
                title="Pick any colour"
              />
              <span className="text-2xs text-wood-500 font-mono w-14 text-right">{selectedItem.colour}</span>
            </div>
          </div>

          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xs text-wood-500 uppercase tracking-wider font-medium">Shading / Shadow</p>
              <span className="text-2xs text-wood-400 font-mono">{Math.round((selectedItem.shading || 0) * 100)}%</span>
            </div>

            <ShadingPreview colour={selectedItem.colour} shading={selectedItem.shading || 0} />

            <input
              type="range"
              min={0} max={1} step={0.05}
              value={selectedItem.shading || 0}
              onChange={e => onUpdateFurniture(selectedItem.id, { shading: parseFloat(e.target.value) })}
              className="w-full mt-2 accent-wood-500"
            />
            <div className="flex justify-between text-2xs text-wood-600 mt-0.5">
              <span>No shadow</span>
              <span>Deep shadow</span>
            </div>
          </div>

          
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-2xs text-wood-500 uppercase tracking-wider font-medium">Opacity</p>
              <span className="text-2xs text-wood-400 font-mono">{Math.round((selectedItem.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2} max={1} step={0.05}
              value={selectedItem.opacity ?? 1}
              onChange={e => onUpdateFurniture(selectedItem.id, { opacity: parseFloat(e.target.value) })}
              className="w-full accent-wood-500"
            />
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-2">
          <span className="text-3xl opacity-20">🎨</span>
          <p className="text-xs text-wood-500 leading-relaxed">
            Click any furniture item on the canvas to change its colour and shading
          </p>
        </div>
      )}

      
      <div className="border-t border-wood-700">
        <div className="px-4 py-3 border-b border-wood-700">
          <p className="text-xs text-wood-400 uppercase tracking-widest font-medium">Room Colours</p>
        </div>

        <div className="p-4 flex flex-col gap-4">

          
          <div>
            <p className="text-2xs text-wood-500 uppercase tracking-wider mb-2 font-medium">Wall Colour</p>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {WALL_PRESETS.map(w => (
                <button
                  key={w.value}
                  onClick={() => onUpdateRoom({ wallColour: w.value })}
                  title={w.label}
                  className={`w-full aspect-square rounded transition-all
                    ${room.wallColour === w.value
                      ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-wood-800 scale-110'
                      : 'hover:scale-105'}`}
                  style={{ background: w.value, border: '1px solid rgba(255,255,255,0.15)' }}
                />
              ))}
            </div>
            <input
              type="color"
              value={room.wallColour || '#FAF7F2'}
              onChange={e => onUpdateRoom({ wallColour: e.target.value })}
              className="w-full h-7 rounded cursor-pointer border border-wood-600 bg-transparent"
            />
          </div>

          
          <div>
            <p className="text-2xs text-wood-500 uppercase tracking-wider mb-2 font-medium">Floor Type</p>
            <div className="grid grid-cols-5 gap-1.5">
              {FLOOR_PRESETS.map(f => (
                <button
                  key={f.value}
                  onClick={() => onUpdateRoom({ floorColour: f.value })}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all
                    ${room.floorColour === f.value
                      ? 'border-blue-400 bg-wood-700'
                      : 'border-wood-600 hover:border-wood-400'}`}
                >
                  <div className="w-6 h-6 rounded" style={{ background: f.value }} />
                  <span className="text-2xs text-wood-500 leading-tight text-center">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
