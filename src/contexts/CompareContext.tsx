import { createContext, useContext, useState, ReactNode } from 'react'

interface Car {
  id: string
  name: string
  brand: string
  model: string
  ex_showroom_price: number
  on_road_price: number
  fuel_type: string
  transmission: string
  seating: number
  engine_cc: number
  images: string[]
  mileage_kmpl: number
  battery_range_km: number
  category: string
  is_electric: boolean
}

interface CompareContextType {
  compareList: Car[]
  addToCompare: (car: Car) => void
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

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<Car[]>([])

  const addToCompare = (car: Car) => {
    if (compareList.length >= 2) {
      alert('You can compare maximum 2 cars at a time')
      return
    }
    if (!compareList.find(c => c.id === car.id)) {
      setCompareList(prev => [...prev, car])
    }
  }

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id))
  }

  const isInCompare = (id: string) => compareList.some(c => c.id === id)
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