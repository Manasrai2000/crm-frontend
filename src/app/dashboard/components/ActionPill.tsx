'use client'

import { Plus, Filter, Search, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

type Props = {
  onAdd?: () => void
  onFilter?: () => void
  onRefresh?: () => void
  onSearch?: (query: string) => void   // 👈 new
  loading?: boolean
}

export default function ActionHeader({
  onAdd,
  onFilter,
  onRefresh,
  onSearch,
  loading = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')

  // 🔹 Automatically call onSearch whenever searchTerm changes
  useEffect(() => {
    if (onSearch) {
      const delay = setTimeout(() => {
        onSearch(searchTerm)   // 👈 call parent function
      }, 500) // debounce (wait 500ms after typing)

      return () => clearTimeout(delay)
    }
  }, [searchTerm, onSearch])

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Pills */}
      <div className="flex items-center gap-2 w-full sm:w-auto rounded-full border border-gray-300 bg-white/90 px-2 py-1">
        <button
          onClick={onAdd}
          className="flex items-center justify-center rounded-full p-2 transition active:scale-[0.97] hover:bg-blue-100 hover:text-blue-600"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={onFilter}
          className="flex items-center justify-center rounded-full p-2 transition active:scale-[0.97] hover:bg-blue-100 hover:text-blue-600"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Search + Refresh */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  )
}
