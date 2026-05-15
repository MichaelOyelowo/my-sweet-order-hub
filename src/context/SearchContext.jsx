import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm]     = useState('')
  const [highlightId, setHighlightId]   = useState(null)
  const [isSearching, setIsSearching]   = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  const applySearch = useCallback((term, productId = null) => {
    setSearchTerm(term)
    setHighlightId(productId)
    setIsSearching(!!term)

    const scrollToProduct = () => {
      if (productId) {
        // Scroll to specific product card
        const el = document.getElementById(`product-card-${productId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
      }
      // Fallback — scroll to order section
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
    }

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(scrollToProduct, 400)
    } else {
      setTimeout(scrollToProduct, 80)
    }
  }, [location.pathname, navigate])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
    setHighlightId(null)
    setIsSearching(false)
  }, [])

  return (
    <SearchContext.Provider value={{
      searchTerm,
      highlightId,
      isSearching,
      applySearch,
      clearSearch,
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}