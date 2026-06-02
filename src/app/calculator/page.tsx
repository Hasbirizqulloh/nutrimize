'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FoodItemOption {
  id: number
  name: string
  category: string
  nutrition: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
  }
}

// Pre-defined "optimized" menu composition for demo
// Maps food item names to their quantity/cost per portion
const OPTIMIZED_MENU = [
  { name: 'Nasi Putih', quantityGrams: 150, cost: 1950 },
  { name: 'Ikan Tongkol', quantityGrams: 100, cost: 3200 },
  { name: 'Tempe', quantityGrams: 75, cost: 1350 },
  { name: 'Bayam', quantityGrams: 70, cost: 560 },
]

export default function CalculatorPage() {
  const router = useRouter()
  const [budget, setBudget] = useState(10000)
  const [portions, setPortions] = useState(250)
  const [isGenerating, setIsGenerating] = useState(false)
  const [menuGenerated, setMenuGenerated] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [foodItems, setFoodItems] = useState<FoodItemOption[]>([])
  const [generatedItems, setGeneratedItems] = useState<typeof OPTIMIZED_MENU>([])
  const [generatedCost, setGeneratedCost] = useState(9800)
  const [substitutionAccepted, setSubstitutionAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch food items on mount to get real IDs from DB
  useEffect(() => {
    fetch('/api/food-items?limit=50')
      .then(res => res.json())
      .then(json => {
        if (json.success) setFoodItems(json.data)
      })
      .catch(() => {/* silent fail, will use fallback */})
  }, [])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Map our pre-defined menu to real food item IDs from DB
      const items = OPTIMIZED_MENU.map(menuItem => {
        const dbItem = foodItems.find(fi => 
          fi.name.toLowerCase() === menuItem.name.toLowerCase()
        )
        if (!dbItem) {
          throw new Error(`Food item "${menuItem.name}" not found in database`)
        }
        return {
          foodItemId: dbItem.id,
          quantityGrams: menuItem.quantityGrams,
          cost: menuItem.cost,
        }
      })

      // Calculate totals based on matched items
      const totalCost = items.reduce((sum, i) => sum + i.cost, 0)

      // Calculate nutrition from food items DB data
      const nutrition = items.reduce((acc, item) => {
        const dbItem = foodItems.find(fi => fi.id === item.foodItemId)
        if (!dbItem) return acc
        const factor = item.quantityGrams / 100
        return {
          calories: acc.calories + dbItem.nutrition.calories * factor,
          protein: acc.protein + dbItem.nutrition.protein * factor,
          carbs: acc.carbs + dbItem.nutrition.carbohydrates * factor,
          fat: acc.fat + dbItem.nutrition.fat * factor,
        }
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

      // Tomorrow's date for the menu
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const menuDate = tomorrow.toISOString().split('T')[0]

      // POST to /api/menus
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitchenId: 'kitchen-bwi-001',
          menuDate,
          packageName: 'Paket Optimasi AI',
          mainDish: 'Ikan Tongkol Rica-Rica',
          totalCalories: Math.round(nutrition.calories),
          totalProtein: Math.round(nutrition.protein * 10) / 10,
          totalCarbs: Math.round(nutrition.carbs * 10) / 10,
          totalFat: Math.round(nutrition.fat * 10) / 10,
          costPerPortion: totalCost,
          portions,
          isAiOptimized: true,
          isSubstituted: true,
          substitutionReason: `Harga daging ayam di Banyuwangi naik 25%. AI Gemini otomatis mengganti ayam dengan Ikan Tongkol lokal untuk menjaga anggaran di bawah Rp ${budget.toLocaleString('id-ID')}.`,
          recipeGuide: '1. Cuci Ikan Tongkol, marinasi dengan bumbu rica-rica. 2. Goreng tempe hingga keemasan. 3. Rebus bayam dengan bawang putih. 4. Sajikan dengan nasi putih hangat.',
          items,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan menu')
      }

      setMenuId(result.data.id)
      setGeneratedItems(OPTIMIZED_MENU)
      setGeneratedCost(totalCost)
      setMenuGenerated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setMenuGenerated(false)
    setMenuId(null)
    setGeneratedItems([])
    setSubstitutionAccepted(false)
    setError(null)
  }

  // Calculate percentage for slider fill background
  const sliderPercent = ((budget - 5000) / 15000) * 100

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
      {/* Left Column: Optimization Settings */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
            <span className="material-symbols-outlined text-[var(--color-brand)]">settings_input_component</span>
            Pengaturan Optimasi
          </h3>
          
          <div className="space-y-6">
            {/* Slider: Target Budget */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Batas Anggaran per Porsi
                </label>
                <span className="text-[var(--color-brand)] font-bold text-base">
                  Rp {budget.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="relative w-full">
                <input 
                  type="range" 
                  min="5000" 
                  max="20000" 
                  step="500"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[var(--color-brand)] cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${sliderPercent}%, #cbd5e1 ${sliderPercent}%, #cbd5e1 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Rp 5.000</span>
                  <span>Rp 20.000</span>
                </div>
              </div>
            </div>

            {/* Input: Portions */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Jumlah Porsi
              </label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none text-slate-900 transition-all" 
                type="number" 
                value={portions}
                onChange={(e) => setPortions(Number(e.target.value))}
              />
            </div>

            {/* Dropdown: Regional Context */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">
                Konteks Wilayah (API)
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none text-slate-900 transition-all">
                  <option>Banyuwangi, Jawa Timur</option>
                  <option>Surabaya, Jawa Timur</option>
                  <option>Malang, Jawa Timur</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  expand_more
                </span>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse"></span>
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  PIHPS Price API: Terhubung
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse"></span>
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wider">
                  Nutrition DB: Terhubung
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <button 
          onClick={menuGenerated ? handleReset : handleGenerate} 
          disabled={isGenerating || foodItems.length === 0}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group text-base cursor-pointer ${
            isGenerating 
              ? 'bg-emerald-400 cursor-not-allowed shadow-none' 
              : menuGenerated
                ? 'bg-slate-700 hover:bg-slate-800 shadow-slate-500/20'
                : 'bg-[var(--color-brand)] hover:bg-emerald-500 shadow-emerald-500/20'
          }`}
        >
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              Memproses Optimasi AI...
            </>
          ) : menuGenerated ? (
            <>
              <span className="material-symbols-outlined">restart_alt</span>
              Reset & Buat Menu Baru
            </>
          ) : (
            <>
              <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">auto_awesome</span>
              ✨ Buat Menu Optimal
            </>
          )}
        </button>
        {foodItems.length === 0 && !isGenerating && (
          <p className="text-xs text-center text-slate-400">Memuat data bahan pangan dari database...</p>
        )}
      </div>

      {/* Right Column: Today's Generated Menu */}
      <div className="space-y-6">
        <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full transition-all duration-500 ${
          menuGenerated ? 'opacity-100' : 'opacity-30 pointer-events-none select-none'
        }`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <span className="material-symbols-outlined text-[var(--color-brand)]">restaurant</span>
              Menu Hasil Generasi Esok Hari
            </h3>
            {menuGenerated && (
              <span className="px-2 py-1 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-[10px] font-bold rounded uppercase tracking-widest">
                Optimasi Berhasil
              </span>
            )}
          </div>

          {/* Menu List */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {(generatedItems.length > 0 ? generatedItems : OPTIMIZED_MENU).map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-[var(--color-brand)] font-bold text-base">
                  {idx + 1}
                </div>
                <span className="font-medium text-slate-700 text-sm">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bars Validation */}
          <div className="space-y-5 mb-8">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 uppercase text-slate-500">
                <span>BIAYA</span>
                <span className={generatedCost <= budget ? "text-[var(--color-brand)]" : "text-red-500"}>
                  Rp {generatedCost.toLocaleString('id-ID')} / Rp {budget.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-brand)] transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (generatedCost / budget) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 uppercase text-slate-500">
                <span>KALORI</span>
                <span className="text-[var(--color-brand)]">820 / 850 kkal</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[96%] bg-[var(--color-brand)]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5 uppercase text-slate-500">
                <span>PROTEIN</span>
                <span className="text-[var(--color-brand)]">17g / Target 15g</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-[var(--color-brand)]"></div>
              </div>
            </div>
          </div>

          {/* Alert Box: AI Substitution */}
          <div className={`border p-5 rounded-xl mb-8 transition-all ${
            substitutionAccepted 
              ? 'bg-emerald-50 border-emerald-200' 
              : 'bg-blue-50 border-blue-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`material-symbols-outlined text-[20px] ${substitutionAccepted ? 'text-emerald-600' : 'text-blue-600'}`}>
                {substitutionAccepted ? 'check_circle' : 'lightbulb'}
              </span>
              <h4 className={`text-sm font-bold ${substitutionAccepted ? 'text-emerald-800' : 'text-blue-800'}`}>
                {substitutionAccepted ? '✅ Substitusi AI Diterima' : '💡 Substitusi Cerdas AI Gemini'}
              </h4>
            </div>
            <p className={`text-xs leading-relaxed mb-4 ${substitutionAccepted ? 'text-emerald-700' : 'text-blue-700'}`}>
              Harga daging ayam di Banyuwangi naik 25% hari ini. AI Gemini otomatis mengganti ayam dengan Ikan Tongkol lokal untuk menjaga anggaran tetap di bawah batas Rp {budget.toLocaleString('id-ID')} sambil mempertahankan 17g protein.
            </p>
            {!substitutionAccepted && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setSubstitutionAccepted(true)}
                  className="flex-1 py-2.5 px-3 bg-emerald-950 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors cursor-pointer"
                >
                  Terima Substitusi AI
                </button>
                <button 
                  onClick={handleReset}
                  className="flex-1 py-2.5 px-3 border border-emerald-900/20 text-emerald-900 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Buat Ulang
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button 
              onClick={() => router.push(`/marketplace?menuId=${menuId}`)}
              disabled={!menuId}
              className="w-full py-4 bg-[var(--color-brand)] hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group text-sm md:text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Teruskan Kebutuhan Bahan ke Pasar Logistik ➔
            </button>
            <p className="text-center text-[10px] md:text-xs text-slate-500 font-medium">
              Daftar belanja akan diotomatisasi untuk pencocokan UMKM.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
