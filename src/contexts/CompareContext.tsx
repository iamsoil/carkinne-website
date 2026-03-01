import { createContext, useContext, useState } from 'react'

interface CompareContextType {
  compareList: any[]
  addToCompare: (car: any) => void
  removeFromCompare: (id: string) => void
  isInCompare: (id: string) => boolean
  clearCompare: () => void
}

const CompareContext = createContext<CompareContextType>({
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
})

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareList, setCompareList] = useState<any[]>([])

  const addToCompare = (car: any) => {
    if (compareList.length >= 3) {
      alert('You can compare maximum 3 cars at a time')
      return
    }
    if (!compareList.find(c => c.id === car.id)) {
      setCompareList(prev => [...prev, car])
    }
  }

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id))
  }

  const isInCompare = (id: string) => {
    return compareList.some(c => c.id === id)
  }

  const clearCompare = () => setCompareList([])

  return (
    <CompareContext.Provider value={{
      compareList, addToCompare, 
      removeFromCompare, isInCompare, clearCompare
    }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext)