'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'

interface AdminStats {
  totalKitchens: number
  totalSuppliers: number
  avgWastePercentage: number
  avgCostPerPortion: number
  totalPortionsToday: number
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nutrimize_user')
    if (!stored) {
      router.push('/login')
      return
    }
    const parsed = JSON.parse(stored)
    if (parsed.role !== 'GOVERNMENT_ADMIN') {
      router.push('/dashboard')
      return
    }
    setUser(parsed)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-2">
      {/* Header Welcome */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Government Admin Portal</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.fullName}</h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Dashboard agregat nasional untuk monitoring program Makan Bergizi Gratis. 
            Data real-time dari seluruh dapur SPPG terhubung.
          </p>
        </div>
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/5 pointer-events-none">shield</span>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Dapur SPPG" 
          value="1"
          icon={<span className="material-symbols-outlined text-[var(--color-brand)]">restaurant</span>}
          trend={{ direction: 'up', value: 'Aktif', label: 'Banyuwangi' }}
        />
        <StatCard 
          title="Total Supplier Mitra" 
          value="5"
          icon={<span className="material-symbols-outlined text-blue-500">store</span>}
          trend={{ direction: 'up', value: '5', label: 'terverifikasi' }}
        />
        <StatCard 
          title="Rata-rata Sisa Pangan" 
          value="12%"
          icon={<span className="material-symbols-outlined text-orange-500">delete_outline</span>}
          trend={{ direction: 'down', value: '-2%', label: 'vs minggu lalu' }}
        />
        <StatCard 
          title="Total Porsi Hari Ini" 
          value="250"
          icon={<span className="material-symbols-outlined text-purple-500">group</span>}
          trend={{ direction: 'neutral', value: 'Stabil' }}
        />
      </section>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--color-brand)]">location_on</span>
            Performa per Wilayah
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Banyuwangi Pusat</h4>
                  <p className="text-xs text-slate-500">Dapur SPPG Banyuwangi • 250 porsi/hari</p>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-wider">Operational</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biaya/Porsi</p>
                  <p className="text-sm font-bold text-slate-900">Rp 12.200</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sisa Pangan</p>
                  <p className="text-sm font-bold text-emerald-600">12%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor Gizi</p>
                  <p className="text-sm font-bold text-[var(--color-brand)]">100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <h3 className="font-bold text-sm tracking-wide">Status Sistem Nasional</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'API Harga Pangan (PIHPS)', status: 'Online', pct: 99 },
                { name: 'Server Gizi Nasional (BGN)', status: 'Online', pct: 98 },
                { name: 'WhatsApp Bot Gateway', status: 'Online', pct: 97 },
                { name: 'AI Gemini Integration', status: 'Standby', pct: 100 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                      <span className="text-xs font-medium text-slate-300">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/5 pointer-events-none">security</span>
        </div>
      </div>
    </div>
  )
}
