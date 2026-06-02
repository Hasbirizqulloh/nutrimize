'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const json = await res.json()

      if (!json.success) {
        setError(json.error?.message || 'Login gagal')
        setLoading(false)
        return
      }

      // Store token & user info
      localStorage.setItem('nutrimize_token', json.data.token)
      localStorage.setItem('nutrimize_user', JSON.stringify(json.data.user))

      // Redirect based on role
      const role = json.data.user.role
      if (role === 'GOVERNMENT_ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Terjadi kesalahan jaringan')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-brand)] rounded-2xl mb-4 shadow-lg shadow-emerald-200/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Nutrimize</h1>
          <p className="text-slate-500 text-sm mt-2">AI Decision Support System — Program MBG</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-1">Selamat Datang</h2>
          <p className="text-sm text-slate-500 mb-6">Masuk ke akun pengelola dapur SPPG Anda</p>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 rounded-lg p-3 mb-4 text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dapur.bwi@nutrimize.id"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition-all"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="h-12 text-base shadow-lg shadow-emerald-200/50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                  Memproses...
                </span>
              ) : 'Masuk'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Akun Demo</p>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-medium">Pengelola Dapur</span>
                <span className="font-mono text-slate-700">dapur.bwi@nutrimize.id</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-medium">Supplier UMKM</span>
                <span className="font-mono text-slate-700">gapoktan.bwi@nutrimize.id</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded-lg">
                <span className="font-medium">Admin Pemerintah</span>
                <span className="font-mono text-slate-700">admin.dinkes@nutrimize.id</span>
              </div>
              <p className="text-center text-[10px] text-slate-400 mt-2">Password: <code className="bg-slate-100 px-1.5 py-0.5 rounded">nutrimize123</code></p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Nutrimize — Powered by GovCloud
        </p>
      </div>
    </div>
  )
}
