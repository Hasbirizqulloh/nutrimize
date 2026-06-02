'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface ShoppingItem {
  foodItemId: number
  foodItem: string
  category: string
  quantityPerPortion: number
  totalKg: number
  estimatedCostPerKg: number | null
  estimatedTotalCost: number | null
  matchedSuppliers: {
    supplierId: string
    name: string
    type: string
    phone: string | null
    isVerified: boolean
    description: string | null
    pricePerKg: number
    stockKg: number | null
  }[]
}

interface ShoppingListData {
  menuId: string
  menuDate: string
  packageName: string | null
  mainDish: string | null
  portions: number
  costPerPortion: number | null
  isSubstituted: boolean
  substitutionReason: string | null
  shoppingItems: ShoppingItem[]
}

const foodEmojis: Record<string, string> = {
  'nasi': '🍚', 'beras': '🍚',
  'ikan': '🐟', 'tongkol': '🐟', 'tuna': '🐟', 'lele': '🐟',
  'ayam': '🐔', 'daging': '🥩',
  'tempe': '🫓', 'tahu': '🫓',
  'bayam': '🥬', 'kangkung': '🥬', 'sayur': '🥬',
  'pisang': '🍌', 'jeruk': '🍊', 'buah': '🍎',
  'telur': '🥚',
}

function getEmoji(name: string): string {
  const lower = name.toLowerCase()
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (lower.includes(key)) return emoji
  }
  return '🍴'
}

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const menuId = searchParams.get('menuId')
  const [shoppingData, setShoppingData] = useState<ShoppingListData | null>(null)
  const [loading, setLoading] = useState(false)
  const [poSending, setPoSending] = useState(false)
  const [poSent, setPoSent] = useState(false)

  const fetchShoppingList = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/menus/${id}/shopping-list`)
      const json = await res.json()
      if (json.success) setShoppingData(json.data)
    } catch {
      /* silent fail — fallback to hardcoded */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (menuId) fetchShoppingList(menuId)
  }, [menuId, fetchShoppingList])

  // Determine shopping items to display (from API or fallback)
  const displayItems = shoppingData?.shoppingItems ?? []
  const hasRealData = displayItems.length > 0

  // Collect all unique suppliers from matched items
  const allSuppliers = hasRealData
    ? Array.from(
        new Map(
          displayItems
            .flatMap(item => item.matchedSuppliers)
            .map(s => [s.supplierId, s])
        ).values()
      )
    : []

  const handleSendPO = async (supplierId: string) => {
    if (!shoppingData) return
    setPoSending(true)

    try {
      // Find items this supplier can fulfill
      const supplierItems = displayItems
        .filter(item => item.matchedSuppliers.some(s => s.supplierId === supplierId))
        .map(item => {
          const supplier = item.matchedSuppliers.find(s => s.supplierId === supplierId)!
          return {
            foodItemId: item.foodItemId,
            quantityKg: item.totalKg,
            pricePerKg: supplier.pricePerKg,
          }
        })

      await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitchenId: 'kitchen-bwi-001',
          supplierId,
          menuId: shoppingData.menuId,
          items: supplierItems,
        }),
      })

      setPoSent(true)
    } catch {
      /* silent fail for demo */
    } finally {
      setPoSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Success Banner from Calculator */}
      {menuId && shoppingData && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in-up">
          <div className="bg-emerald-100 p-2 rounded-lg text-[var(--color-brand)]">
            <span className="material-symbols-outlined block">check_circle</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">
              Berhasil memuat daftar belanja dari AI Kalkulator
            </h4>
            <p className="text-xs text-emerald-700 mt-1">
              Menu: <strong>{shoppingData.mainDish}</strong> ({shoppingData.packageName}) — {shoppingData.portions} porsi untuk tanggal {shoppingData.menuDate}
            </p>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
          <span className="material-symbols-outlined animate-spin text-blue-500 mr-2">refresh</span>
          <span className="text-sm text-blue-700">Memuat data belanja dari menu AI...</span>
        </div>
      )}

      {/* PO Sent Banner */}
      {poSent && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in-up">
          <div className="bg-emerald-100 p-2 rounded-lg text-[var(--color-brand)]">
            <span className="material-symbols-outlined block">send</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-900">Purchase Order berhasil dikirim!</h4>
            <p className="text-xs text-emerald-700 mt-1">PO telah disimpan ke database dan siap dikirim via WhatsApp.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[80vh]">
        
        {/* Left Pane: Map Visualization */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-20">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--color-brand)]">map</span>
              Peta Pasokan & Radius Lokal
            </h3>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-[var(--color-brand)] bg-[var(--color-brand)]/20"></span> 5km
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-[var(--color-brand)]/40 bg-[var(--color-brand)]/5"></span> 10km
              </span>
            </div>
          </div>
          
          <div className="flex-1 relative bg-slate-200 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFA8QvvHeaE_xAZ12pJPlnPAlwyxHsdXl8tD-G2EV7Qe8F3M_aFNPHDPwqDY9c6S0Q9C4I5g2-X8UgLHPOOhK1J-X6Y6B0T81lqiUk_ee8ZOv68PEoQcXipb9IMXyiPtKoAz9_7K84e_dVt5AKrO8yaz2IcVTtC8RFl4Q3ynGgzqnN_ds_PpOuvUyS7I1evdLOqEB-UwnnaQZ9YMf7aPa14RpTlBZApzFL7ioz6SIF5TSIsTRj-pwWHz0ydgJKC6ntmOwf8Ns2SYRq')" }}
            ></div>
            
            {/* Central Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
              <div className="relative">
                <div className="absolute -inset-4 bg-[var(--color-brand)]/20 rounded-full animate-ping"></div>
                <div className="bg-[var(--color-brand)] text-white p-2 rounded-full shadow-lg border-2 border-white relative">
                  <span className="material-symbols-outlined block">home_pin</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-slate-200 whitespace-nowrap">
                  <p className="text-xs font-bold text-slate-900">Dapur SPPG Banyuwangi</p>
                </div>
              </div>
            </div>
            
            {/* Radius Visuals */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5 rounded-full w-64 h-64 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[var(--color-brand)]/10 bg-[var(--color-brand)]/5 rounded-full w-[32rem] h-[32rem] pointer-events-none"></div>
            
            {/* Supplier Pins */}
            <div className="absolute top-1/3 left-1/3 z-10 cursor-pointer flex flex-col items-center">
              <div className="bg-[var(--color-brand)] text-white p-1 rounded-full shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-sm block">verified</span>
              </div>
              <div className="mt-1 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap border border-slate-200">Gapoktan Maju Bersama</div>
            </div>
            
            <div className="absolute bottom-1/4 right-1/3 z-10 cursor-pointer flex flex-col items-center">
              <div className="bg-[var(--color-brand)] text-white p-1 rounded-full shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-sm block">verified</span>
              </div>
              <div className="mt-1 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap border border-slate-200">Nelayan Berkah Muncar</div>
            </div>
            
            <div className="absolute top-1/2 right-1/4 z-10 cursor-pointer flex flex-col items-center">
              <div className="bg-[var(--color-brand)] text-white p-1 rounded-full shadow-md border-2 border-white">
                <span className="material-symbols-outlined text-sm block">verified</span>
              </div>
              <div className="mt-1 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap border border-slate-200">UMKM Tempe Bu Darmi</div>
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200">
              <p className="text-xs font-medium text-slate-600">
                Menampilkan: <span className="text-[var(--color-brand)] font-bold">Radius Pasokan Gizi 5km & 10km</span> di area Banyuwangi Kota. 
                Semua mitra dalam radius telah melewati audit higienitas.
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: Catalog */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            
            {/* Shopping List Section — Dynamic from API */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">inventory_2</span>
                {hasRealData ? 'Daftar Belanja dari AI Kalkulator' : 'Daftar Belanja Gizi Esok Hari (Hasil Menu AI)'}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {hasRealData ? (
                  displayItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <span className="text-xl mb-1">{getEmoji(item.foodItem)}</span>
                      <p className="text-[10px] font-bold text-slate-900 truncate w-full">{item.foodItem}</p>
                      <p className="text-[11px] font-bold text-[var(--color-brand)]">{item.totalKg} kg</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <span className="text-xl mb-1">🐔</span>
                      <p className="text-[10px] font-bold text-slate-900 truncate w-full">Daging Ayam</p>
                      <p className="text-[11px] font-bold text-[var(--color-brand)]">12 kg</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <span className="text-xl mb-1">🥬</span>
                      <p className="text-[10px] font-bold text-slate-900 truncate w-full">Sayur Bayam</p>
                      <p className="text-[11px] font-bold text-[var(--color-brand)]">8 kg</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                      <span className="text-xl mb-1">🐟</span>
                      <p className="text-[10px] font-bold text-slate-900 truncate w-full">Ikan Tongkol</p>
                      <p className="text-[11px] font-bold text-[var(--color-brand)]">10 kg</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-5 border-b border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Katalog Mitra Pangan Cerdas</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-[var(--color-brand)] rounded-full animate-pulse"></span>
                    PIHPS API Price Check: Active
                  </p>
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined">tune</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select className="w-full bg-slate-50 border-slate-200 rounded-xl text-xs font-medium focus:ring-[var(--color-brand)] py-2 px-3 outline-none">
                    <option>Zona: Banyuwangi</option>
                  </select>
                </div>
                <div className="relative">
                  <select className="w-full bg-slate-50 border-slate-200 rounded-xl text-xs font-medium focus:ring-[var(--color-brand)] py-2 px-3 outline-none">
                    <option>Radius: &lt;10 km</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-5 space-y-4">
              {/* Dynamic Supplier Cards from API */}
              {hasRealData && allSuppliers.length > 0 ? (
                allSuppliers.map((supplier, idx) => {
                  // Find which items this supplier provides
                  const suppliedItems = displayItems.filter(item => 
                    item.matchedSuppliers.some(s => s.supplierId === supplier.supplierId)
                  )
                  const iconColors = ['bg-[var(--color-brand-light)] text-[var(--color-brand)]', 'bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600']
                  const iconNames = ['eco', 'set_meal', 'storefront']

                  return (
                    <div key={supplier.supplierId} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-[var(--color-brand)]/30 transition-all group">
                      <div className="flex gap-4">
                        <div className={`size-12 rounded-xl ${iconColors[idx % iconColors.length]} flex items-center justify-center flex-shrink-0`}>
                          <span className="material-symbols-outlined text-2xl">{iconNames[idx % iconNames.length]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {supplier.isVerified && <span className="material-symbols-outlined text-[var(--color-brand)] text-sm">verified</span>}
                            <h4 className="text-sm font-bold text-slate-900">{supplier.name}</h4>
                          </div>
                          <div className="flex items-center gap-1 mb-2 text-[var(--color-brand)] font-bold text-[10px]">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            Pencocokan AI: Menyediakan {suppliedItems.map(i => i.foodItem).join(', ')}
                          </div>
                          <p className="text-xs text-slate-500 mb-3">{supplier.description || `Supplier ${supplier.type.toLowerCase()} terverifikasi.`}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Harga Estimasi</p>
                              <p className="text-sm font-bold text-[var(--color-brand)]">
                                Rp {supplier.pricePerKg.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">/ kg</span>
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="text-[10px] py-1.5 px-3 h-auto"
                              onClick={() => handleSendPO(supplier.supplierId)}
                              disabled={poSending}
                            >
                              <span className="material-symbols-outlined text-xs mr-1">shopping_cart</span> 
                              {poSending ? 'Mengirim...' : 'Pesan'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <>
                  {/* Fallback: Static Supplier Cards */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-[var(--color-brand)]/30 transition-all group">
                    <div className="flex gap-4">
                      <div className="size-12 rounded-xl bg-[var(--color-brand-light)] text-[var(--color-brand)] flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">eco</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="material-symbols-outlined text-[var(--color-brand)] text-sm">verified</span>
                          <h4 className="text-sm font-bold text-slate-900">Gapoktan Sayur Licin</h4>
                        </div>
                        <div className="flex items-center gap-1 mb-2 text-[var(--color-brand)] font-bold text-[10px]">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Pencocokan Menu AI: Menyediakan Sayur Bayam
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Sayur Bayam, Tomat, Cabe segar dari lereng Ijen.</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Harga Estimasi</p>
                            <p className="text-sm font-bold text-[var(--color-brand)]">Rp 15.000 <span className="text-[10px] text-slate-400 font-normal">/ kg</span> <span className="ml-1 text-[10px] bg-[var(--color-brand)]/10 px-1 rounded text-[var(--color-brand-hover)]">Bawah Pasar</span></p>
                          </div>
                          <Button size="sm" className="text-[10px] py-1.5 px-3 h-auto">
                            <span className="material-symbols-outlined text-xs mr-1">chat</span> Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-[var(--color-brand)]/30 transition-all group">
                    <div className="flex gap-4">
                      <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl">set_meal</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="material-symbols-outlined text-[var(--color-brand)] text-sm">verified</span>
                          <h4 className="text-sm font-bold text-slate-900">Nelayan Muncar</h4>
                        </div>
                        <div className="flex items-center gap-1 mb-2 text-[var(--color-brand)] font-bold text-[10px]">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Pencocokan Menu AI: Menyediakan Ikan Tongkol
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Ikan Tongkol Segar, Ikan Layang kualitas ekspor.</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Harga Estimasi</p>
                            <p className="text-sm font-bold text-slate-900">Rp 28.000 <span className="text-[10px] text-slate-400 font-normal">/ kg</span></p>
                          </div>
                          <Button size="sm" className="text-[10px] py-1.5 px-3 h-auto">
                            <span className="material-symbols-outlined text-xs mr-1">chat</span> Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Empty State Card */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">person_search</span>
                <p className="text-[11px] font-medium text-slate-400">Gunakan filter untuk menemukan lebih banyak mitra lokal terverifikasi</p>
              </div>
            </div>

            {/* Final Order UX */}
            <div className="p-5 bg-white border-t border-slate-100">
              <Button 
                fullWidth 
                size="lg" 
                className="h-12 shadow-lg flex gap-2"
                onClick={() => {
                  if (allSuppliers.length > 0) {
                    allSuppliers.forEach(s => handleSendPO(s.supplierId))
                  } else {
                    alert('📋 PO akan dikirim via WhatsApp ke semua mitra!')
                  }
                }}
              >
                <span className="material-symbols-outlined">send_and_archive</span>
                <span className="text-sm">Konfirmasi & Kirim PO via WhatsApp</span>
              </Button>
              <button className="w-full mt-3 text-xs font-bold text-[var(--color-brand)] hover:underline">
                Lihat Semua 24 Mitra Terverifikasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat Pasar Logistik...</div>}>
      <MarketplaceContent />
    </Suspense>
  )
}
