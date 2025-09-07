'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { API } from '@/config/api_urls'

type ModuleData = {
  public_secret?: string;
  module_code: string;
  name: string;
  description: string;
  is_active: boolean;
};

type Props = {
  open: boolean
  mode: 'add' | 'edit'
  initialData?: ModuleData
  onClose: () => void
  onSuccess?: () => void
}

export default function AddModuleForm({
  open,
  mode,
  initialData,
  onClose,
  onSuccess,
}: Props) {
  let [formData, setFormData] = useState<ModuleData>({
    name: '',
    module_code: '',
    description: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: '',
        module_code: '',
        description: '',
        is_active: true,
      })
    }
  }, [mode, initialData, open])

  if (!open) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access') || ''
          : ''

      if (mode === 'add') {
        await axios.post(API.MODULE_CREATE, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      } else if (mode === 'edit' && initialData?.public_secret) {
        await axios.put(`${API.MODULE_UPDATE}${initialData.public_secret}/`, formData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      }

      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving module:', error)
      alert('Failed to save module')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.public_secret) return
    if (!window.confirm('Are you sure you want to delete this module?')) return
    setLoading(true)
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('access') || ''
          : ''
      await axios.delete(`${API.MODULE_UPDATE}${initialData.public_secret}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      console.error('Error deleting module:', error)
      alert('Failed to delete module')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'add' ? 'Add Module' : 'Edit Module'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Module Code</label>
            <input
              type="text"
              name="module_code"
              value={formData.module_code}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm">Active</label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? mode === 'edit'
                  ? 'Updating...'
                  : 'Saving...'
                : mode === 'add'
                ? 'Save'
                : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
