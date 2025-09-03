'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Splash() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const refreshToken = localStorage.getItem("refresh")

      if (refreshToken) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-center">
        {/* Loader (spinner) */}
        <div className="mb-4 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>

        {/* App Name */}
        <h1 className="text-2xl font-bold">Welcome to CRM</h1>
      </div>
    </div>
  )
}
