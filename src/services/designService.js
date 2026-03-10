// designService.js — Asantha
// Handles saving, loading, updating and deleting designs from localStorage

const DESIGNS_KEY = 'roomcraft_designs'

const load = () => {
  try {
    const raw = localStorage.getItem(DESIGNS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (_e) { return [] }
}

const persist = (designs) => {
  localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs))
}

export const designService = {
  /** Get all designs for a specific user */
  getByUser: (userId) => load().filter(d => d.userId === userId),

  /** Get a single design by id */
  getById: (id) => load().find(d => d.id === id) || null,

  /** Save a new design */
  create: (design) => {
    const designs = load()
    const newDesign = { ...design, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    persist([...designs, newDesign])
    return newDesign
  },

  /** Update an existing design */
  update: (id, changes) => {
    const designs = load()
    const updated = designs.map(d =>
      d.id === id ? { ...d, ...changes, updatedAt: new Date().toISOString() } : d
    )
    persist(updated)
    return updated.find(d => d.id === id)
  },

  /** Delete a design */
  delete: (id) => {
    persist(load().filter(d => d.id !== id))
  },
}
