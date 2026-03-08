import { useContext } from 'react'
import { DesignContext } from '../context/DesignContext'

/** useDesign — quick access to current design in any component */
export function useDesign() {
  const ctx = useContext(DesignContext)
  if (!ctx) throw new Error('useDesign must be used inside <DesignProvider>')
  return ctx
}
