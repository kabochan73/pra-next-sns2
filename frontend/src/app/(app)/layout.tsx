'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { BookOpen, LogOut, } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, token, fetchUser, logout } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.replace('/login')
      return
    }
    if (!user) {
      fetchUser().catch(() => {
        router.replace('/login')
      })
    }
  }, [token, user, fetchUser, router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (!token || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/feed" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen className="w-5 h-5" />
            学習本SNS
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{user.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
