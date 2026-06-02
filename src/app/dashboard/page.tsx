'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardData {
  kitchen: {
    id: string
    name: string
    region: string
    dailyBudget: number
    dailyPortions: number
    status: string
  }
  kpi: {
    costPerPortion: number
    totalPortions: number
    nutritionScore: number
    wastePercentage: number
    pendingOrders: number
    suppliersNearby: number
  }
  todayMenu: {
    id: string
    packageName: string | null
    mainDish: string | null
    status: string
    isAiOptimized: boolean
    isSubstituted: boolean
    substitutionReason: string | null
    recipeGuide: string | null
    nutrition: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    costPerPortion: number
    totalCost: number
    portions: number
    items: {
      id: string
      foodItem: string
      category: string
      quantityGrams: number
      cost: number | null
    }[]
  } | null
  weeklyTrend: {
    date: string
    costPerPortion: number
    status: string
  }[]
}

interface PurchaseOrderData {
  id: string
  supplier: {
    name: string
    type: string
    phone: string | null
  }
  menu: {
    mainDish: string | null
    menuDate: string
  } | null
  orderDate: string
  totalAmount: number
  status: string
  items: {
    foodItem: string
    unit: string
    quantityKg: number
    pricePerKg: number
    subtotal: number
  }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [orders, setOrders] = useState<PurchaseOrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const kitchenId = 'kitchen-bwi-001'

    // Fetch KPI and Purchase Orders
    Promise.all([
      fetch(`/api/dashboard/kpi?kitchenId=${kitchenId}`).then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data KPI dashboard')
        return res.json()
      }),
      fetch(`/api/purchase-orders?kitchenId=${kitchenId}`).then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data logistik')
        return res.json()
      })
    ])
      .then(([kpiJson, poJson]) => {
        if (kpiJson.success) {
          setData(kpiJson.data)
        } else {
          throw new Error(kpiJson.message || 'Unknown KPI error')
        }
        if (poJson.success) {
          setOrders(poJson.data)
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const getFoodEmoji = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('nasi') || n.includes('rice')) return '🍚'
    if (n.includes('ayam') || n.includes('chicken')) return '🐔'
    if (n.includes('kangkung') || n.includes('bayam') || n.includes('sayur') || n.includes('sawi')) return '🥬'
    if (n.includes('pisang') || n.includes('banana') || n.includes('buah') || n.includes('apel') || n.includes('jeruk')) return '🍌'
    if (n.includes('susu') || n.includes('milk')) return '🥛'
    if (n.includes('telur') || n.includes('egg')) return '🥚'
    if (n.includes('daging') || n.includes('sapi') || n.includes('beef')) return '🥩'
    if (n.includes('ikan') || n.includes('fish') || n.includes('tongkol') || n.includes('lele')) return '🐟'
    if (n.includes('tahu') || n.includes('tofu')) return '🫓'
    if (n.includes('tempe') || n.includes('tempeh')) return '🫓'
    return '🍴'
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl w-full"></div>
          <div className="h-96 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100">
        <h3 className="font-bold text-lg">Gagal memuat data dashboard</h3>
        <p className="text-sm mt-1">{error || 'Data tidak ditemukan'}</p>
      </div>
    )
  }

  const { kitchen, kpi, todayMenu } = data

  // Dynamic values or fallback
  const costVal = kpi.costPerPortion > 0 ? kpi.costPerPortion : 9850
  const budgetVal = kitchen.dailyBudget > 0 ? kitchen.dailyBudget : 15000
  const portionsVal = kpi.totalPortions > 0 ? kpi.totalPortions : 250
  const caloriesVal = todayMenu?.nutrition?.calories ?? 850
  const proteinVal = todayMenu?.nutrition?.protein ?? 18
  const scoreVal = kpi.nutritionScore > 0 ? kpi.nutritionScore : 100
  const wasteVal = kpi.wastePercentage > 0 ? kpi.wastePercentage : 12

  // Determine displayed orders (or fall back to mockup)
  const displayedOrders = orders && orders.length > 0
    ? orders.map(order => {
        let foodName = 'Logistik Masuk'
        if (order.items && order.items.length > 0) {
          foodName = order.items.map(item => item.foodItem).join(', ')
          if (foodName.length > 25) {
            foodName = foodName.slice(0, 22) + '...'
          }
        }
        return {
          id: order.id,
          foodName,
          supplierName: order.supplier.name,
          statusText: order.status === 'DELIVERED' ? 'Diterima' : order.status === 'PENDING' ? 'Siap Dikirim' : 'Dikonfirmasi',
          statusColor: order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
        }
      }).slice(0, 2)
    : [
        {
          id: 'mock-1',
          foodName: 'Sayur Bayam Segar',
          supplierName: 'Gapoktan Sayur Licin (UMKM)',
          statusText: 'Siap Dikirim',
          statusColor: 'bg-blue-50 text-blue-700'
        },
        {
          id: 'mock-2',
          foodName: 'Ikan Tongkol',
          supplierName: 'Nelayan Muncar',
          statusText: 'Siap Dikirim',
          statusColor: 'bg-blue-50 text-blue-700'
        }
      ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* BEGIN: KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-purpose="kpi-cards">
        {/* Cost Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Biaya per Porsi</p>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Rp {costVal.toLocaleString('id-ID')}</h3>
                {costVal <= budgetVal ? (
                  <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                    Sesuai Anggaran (Limit: Rp {(budgetVal / 1000).toFixed(0)}k)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-[10px] font-medium bg-red-100 text-red-800">
                    Melebihi Anggaran (Limit: Rp {(budgetVal / 1000).toFixed(0)}k)
                  </span>
                )}
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-govBlue flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Portions Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Porsi Hari Ini</p>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{portionsVal} Portions</h3>
                <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                  Target Tercapai
                </span>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Target Gizi (BGN)</p>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{caloriesVal} kcal</h3>
                <p className="text-xs text-slate-500">{proteinVal}g Protein reached</p>
              </div>
              <div 
                className="relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(#10B981 ${scoreVal}%, #e2e8f0 0)`
                }}
              >
                <span className="text-[10px] font-bold text-brandGreen">{scoreVal}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Peringatan Sisa Pangan</p>
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900">{wasteVal}%</h3>
              <p className="text-xs text-orange-600 font-medium mt-1">
                {wasteVal > 15 
                  ? "Penyumbang Terbesar: Tumis Kangkung (35% tidak dimakan)." 
                  : "Penyumbang Terbesar: Tumis Kangkung (35% tidak dimakan)."}
              </p>
            </div>
          </div>
          <button 
            onClick={() => router.push('/waste-analytics')}
            className="mt-4 text-left text-[11px] font-bold text-brandGreen hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            Lihat Analitik Lengkap ➔
          </button>
        </div>
      </section>
      {/* END: KPI Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BEGIN: Optimized Menu Section */}
        <div className="lg:col-span-2 space-y-6" data-purpose="menu-section">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Menu Breakdown Hari Ini</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              Optimized by AI
            </span>
          </div>

          {/* Makan Siang Visual Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-8 relative">
              {/* Top Right Thumbnail */}
              <div className="absolute top-8 right-8 hidden sm:block">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-sm">
                  <img 
                    alt="Lunch plate" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb4LwjKmYClCm4QgFTeaumR_9ZTqq5XML8JYH0pGPZaqIp6U4K1Ci3Art_rc4b4Dd7dXhD30o4-FCQUHUOqK5Bm931DFJ6BdJfFplnW_83YVUVmnBW_iZhBlJS2-qVBhRkkTgJ2mT9TSdDfsAYMU5VYgG90WbpuePL_RKizdgPCk5FKRpmtIPX2gXcn9bC6H0-GhKtA8eTky2jZ8z-4gcUjf8D3UEWmNaKkq93rcWYFcmJNQUgSsXMbp9xQAdv-YZn3M829EreN1XN"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide mb-3 border border-emerald-100">
                  <span>✨ AI Optimized Menu</span>
                </div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{todayMenu?.packageName || 'Paket Nutrisi A'}</h3>
                    <p className="text-sm text-slate-500">
                      Menu Utama: <span className="font-semibold text-slate-700">{todayMenu?.mainDish || 'Ayam Woku Kemangi'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Kalori</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-brandGreen leading-none">{caloriesVal}</span>
                      <span className="text-xs font-bold text-slate-500">kkal</span>
                    </div>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Jadwal</p>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-brandGreen">schedule</span>
                      <span className="text-sm font-bold text-slate-700">12:00 WIB</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Komposisi Bahan &amp; Takaran</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {todayMenu?.items && todayMenu.items.length > 0 ? (
                      todayMenu.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brandGreen/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getFoodEmoji(item.foodItem)}</span>
                            <span className="text-sm font-medium text-slate-700">{item.foodItem}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {item.quantityGrams}{item.foodItem.toLowerCase().includes('pisang') || item.foodItem.toLowerCase().includes('pcs') ? ' Pcs' : 'g'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brandGreen/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🍚</span>
                            <span className="text-sm font-medium text-slate-700">Nasi Putih</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">150g</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brandGreen/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🐔</span>
                            <span className="text-sm font-medium text-slate-700">Ayam Woku</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">100g</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brandGreen/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🥬</span>
                            <span className="text-sm font-medium text-slate-700">Tumis Kangkung</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">70g</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-brandGreen/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">🍌</span>
                            <span className="text-sm font-medium text-slate-700">Pisang Ambon</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">1 Pcs</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <button 
                    onClick={() => alert('Mengunduh Panduan Resep...')}
                    className="flex items-center justify-center gap-2 text-slate-600 hover:text-brandGreen text-sm font-bold transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                    Unduh Resep
                  </button>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => router.push('/calculator')}
                      className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer flex-1 sm:flex-initial"
                    >
                      Edit Menu
                    </button>
                    <button 
                      onClick={() => alert('Porsi tervalidasi sukses!')}
                      className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-sm cursor-pointer flex-1 sm:flex-initial"
                    >
                      Validasi Porsi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* END: Optimized Menu Section */}

        {/* BEGIN: Side Widgets */}
        <aside className="space-y-8" data-purpose="side-widgets">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Pasokan Logistik Esok Hari</h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 overflow-hidden">
              {displayedOrders.map((order, idx) => (
                <div 
                  key={order.id} 
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className={`w-12 h-12 ${idx === 0 ? 'bg-emerald-50' : 'bg-blue-50'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <div className={`w-3 h-3 ${idx === 0 ? 'bg-emerald-400' : 'bg-blue-400'} rounded-full`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{order.foodName}</h4>
                    <p className="text-xs text-slate-500 truncate">{order.supplierName}</p>
                  </div>
                  <span className={`px-2.5 py-1 ${order.statusColor} text-[10px] font-bold rounded-lg whitespace-nowrap uppercase`}>
                    {order.statusText}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button 
                onClick={() => router.push('/marketplace')}
                className="w-full bg-brandGreen text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-200/50 hover:bg-emerald-700 transition-all flex items-center justify-center cursor-pointer"
              >
                Hubungkan ke UMKM Lokal
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-widest font-semibold">
                Powered by Nutrimize GovCloud
              </p>
            </div>
          </div>

          {/* Health Snapshot Widget (Premium Look) */}
          <div className="bg-slate-800 text-white rounded-2xl p-6 overflow-hidden relative shadow-lg">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-emerald-400">verified</span>
                <h4 className="font-bold text-sm tracking-wide">Status Integrasi Sistem (BGN)</h4>
              </div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Dapur SPPG Banyuwangi terhubung aktif dengan Server Pusat Badan Gizi Nasional dan API Harga Pangan (PIHPS).
              </p>
              <div className="flex flex-wrap gap-y-2 gap-x-3 mb-6 border-t border-white/10 pt-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                  <span>API Harga: Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                  <span>Server Gizi: Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                  <span>WA Bot: Aktif</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Performance</span>
                  <span className="text-emerald-400">98%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 w-[98%] h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-white/5 pointer-events-none">
              bar_chart
            </span>
          </div>
        </aside>
        {/* END: Side Widgets */}
      </div>
    </div>
  )
}
