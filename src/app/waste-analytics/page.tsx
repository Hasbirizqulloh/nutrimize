'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface MenuOption {
  id: string
  menuDate: string
  packageName: string | null
  mainDish: string | null
  items: { id: number; foodItem: string; category: string; quantityGrams: number }[]
}

export default function WasteAnalyticsPage() {
  const router = useRouter()
  const [menus, setMenus] = useState<MenuOption[]>([])
  const [selectedMenuId, setSelectedMenuId] = useState<string>('')
  const [wasteInputs, setWasteInputs] = useState<Record<string, number>>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch recent menus on mount
  useEffect(() => {
    fetch('/api/menus?kitchenId=kitchen-bwi-001&days=14')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setMenus(json.data)
          setSelectedMenuId(json.data[0].id)
          // Initialize waste inputs for first menu
          const initial: Record<string, number> = {}
          json.data[0].items.forEach((item: { foodItem: string }) => {
            // Default realistic waste values
            initial[item.foodItem] = item.foodItem.toLowerCase().includes('kangkung') ? 35
              : item.foodItem.toLowerCase().includes('bayam') ? 18
              : item.foodItem.toLowerCase().includes('sayur') ? 20
              : item.foodItem.toLowerCase().includes('nasi') ? 5
              : 12
          })
          setWasteInputs(initial)
        }
      })
      .catch(() => {
        // Fallback if API fails
        setWasteInputs({ 'Nasi Putih': 5, 'Ayam Woku': 12, 'Tumis Kangkung': 35 })
      })
  }, [])

  // When selected menu changes, update waste inputs
  useEffect(() => {
    if (!selectedMenuId || menus.length === 0) return
    const menu = menus.find(m => m.id === selectedMenuId)
    if (!menu) return
    
    const initial: Record<string, number> = {}
    menu.items.forEach(item => {
      initial[item.foodItem] = wasteInputs[item.foodItem] ?? 
        (item.foodItem.toLowerCase().includes('kangkung') || item.foodItem.toLowerCase().includes('bayam') ? 25 : 10)
    })
    setWasteInputs(initial)
    setSaved(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenuId])

  const selectedMenu = menus.find(m => m.id === selectedMenuId)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setSaved(false)

    try {
      // POST waste logs for each item in the selected menu
      if (selectedMenu) {
        for (const item of selectedMenu.items) {
          const wastePercent = wasteInputs[item.foodItem] ?? 0
          await fetch('/api/waste', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              menuId: selectedMenuId,
              foodItemId: item.id,
              wastePercentage: wastePercent,
              logDate: selectedMenu.menuDate,
              notes: wastePercent > 25 ? 'Sisa cukup tinggi — perlu perhatian' : null,
            }),
          })
        }
        setSaved(true)
      }
    } catch {
      /* silent fail for demo */
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Find the worst offender for AI recommendation
  const worstItem = Object.entries(wasteInputs).sort((a, b) => b[1] - a[1])[0]
  const avgWaste = Object.values(wasteInputs).length > 0
    ? Math.round(Object.values(wasteInputs).reduce((a, b) => a + b, 0) / Object.values(wasteInputs).length)
    : 0

  // Data for the dummy bar chart
  const chartData = [
    { day: 'Sen', value: 60 },
    { day: 'Sel', value: 45 },
    { day: 'Rab', value: 80 },
    { day: 'Kam', value: 35 },
    { day: 'Jum', value: 55 },
    { day: 'Sab', value: 90 },
    { day: 'Min', value: 25 },
  ]

  return (
    <div className="space-y-8 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column Left: Input & KPI */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Input Data Sisa Harian */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[var(--color-brand)]">edit_note</span>
              <h3 className="font-bold text-slate-800">Input Sisa Pangan Hari Ini</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Pilih Menu Target</label>
                <select 
                  className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-[var(--color-brand)] focus:border-[var(--color-brand)] py-2 px-3 outline-none"
                  value={selectedMenuId}
                  onChange={(e) => setSelectedMenuId(e.target.value)}
                >
                  {menus.length > 0 ? (
                    menus.map(menu => (
                      <option key={menu.id} value={menu.id}>
                        {menu.menuDate} — {menu.packageName || menu.mainDish || 'Menu'}
                      </option>
                    ))
                  ) : (
                    <option>Makan Siang - Paket Nutrisi A</option>
                  )}
                </select>
              </div>
              
              <div className="space-y-4 pt-2">
                {Object.entries(wasteInputs).map(([itemName, value]) => {
                  const isHigh = value > 30
                  return (
                    <div key={itemName} className={`${isHigh ? 'p-3 rounded-lg border bg-red-50 border-red-100' : ''}`}>
                      <div className="flex justify-between mb-1">
                        <label className={`text-sm font-medium ${isHigh ? 'font-bold text-red-700' : 'text-slate-700'}`}>
                          {itemName}
                        </label>
                        <span className={`text-xs font-bold ${isHigh ? 'text-red-600' : 'text-slate-500'}`}>
                          {value}%
                        </span>
                      </div>
                      <input 
                        className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
                          isHigh ? 'bg-red-200 accent-red-500' : 'bg-slate-200 accent-[var(--color-brand)]'
                        }`}
                        type="range" 
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setWasteInputs({...wasteInputs, [itemName]: Number(e.target.value)})}
                      />
                    </div>
                  )
                })}
              </div>

              {saved && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Data waste berhasil disimpan ke database!
                </div>
              )}
              
              <Button 
                fullWidth 
                size="lg" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-4 shadow-lg shadow-emerald-200/50 flex gap-2 h-12"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">auto_fix_high</span>
                    Simpan & Analisis dengan AI
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Simplified KPI Grid */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Rata-rata Sisa Menu Ini</p>
              <div className="flex items-end justify-between">
                <h3 className={`text-2xl font-bold ${avgWaste > 20 ? 'text-orange-500' : 'text-emerald-600'}`}>{avgWaste}%</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 border ${
                  avgWaste > 20 
                    ? 'bg-orange-50 text-orange-600 border-orange-100' 
                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  <span className="material-symbols-outlined text-xs">{avgWaste > 20 ? 'trending_up' : 'trending_down'}</span> {avgWaste > 20 ? 'Tinggi' : 'Normal'}
                </span>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimasi Kerugian Negara</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-orange-500">Rp {(avgWaste * 5000).toLocaleString('id-ID')}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded flex items-center gap-0.5 border border-orange-100">
                  <span className="material-symbols-outlined text-xs">trending_up</span> 5%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column Right: Chart */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-bold text-slate-900">Tren Sisa Pangan Harian</h3>
                <p className="text-sm text-slate-500">7 Hari Terakhir (Rata-rata {avgWaste}%)</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]"></span> % Sisa
                </span>
              </div>
            </div>
            
            {/* Bar Chart */}
            <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[300px]">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden" style={{ height: `${d.value}%` }}>
                    <div className="absolute bottom-0 w-full bg-[var(--color-brand-hover)]/40 group-hover:bg-[var(--color-brand)] transition-colors h-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Recommendation Banner — Dynamic based on worst item */}
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6 items-center transition-all">
        <div className="p-4 bg-white rounded-2xl shadow-sm text-[var(--color-brand)] flex-shrink-0">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-bold text-slate-900 mb-2">🔄 Rekomendasi Adaptif AI untuk Minggu Depan</h3>
          <p className="text-slate-600 leading-relaxed max-w-4xl">
            {worstItem ? (
              <>
                Sistem mendeteksi <span className="font-bold text-red-500">{worstItem[1]}% sisa</span> pada <strong>{worstItem[0]}</strong> hari ini. 
                Rekomendasi AI: Ganti dengan <span className="text-[var(--color-brand)] font-bold">menu alternatif yang lebih disukai siswa</span> untuk 
                menu minggu depan guna menekan kerugian sebesar <span className="font-bold text-orange-600">Rp {(avgWaste * 5000).toLocaleString('id-ID')}</span>.
              </>
            ) : (
              'Memuat rekomendasi AI...'
            )}
          </p>
        </div>
        <div className="flex-shrink-0 mt-4 md:mt-0">
          <Button 
            size="lg" 
            className="shadow-lg shadow-emerald-200/50 flex gap-2 h-12"
            onClick={() => router.push('/calculator')}
          >
            <span className="material-symbols-outlined text-sm">settings_suggest</span>
            Terapkan Rekomendasi
          </Button>
        </div>
      </div>
    </div>
  )
}
