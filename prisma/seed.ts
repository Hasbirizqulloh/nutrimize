/**
 * @file prisma/seed.ts
 * @description Seed script untuk mengisi database Nutrimize dengan data demo
 *              wilayah Banyuwangi, Jawa Timur. Mencakup 14 model Prisma.
 *
 * @usage
 *   npx tsx prisma/seed.ts
 *
 * @note Data nutrisi berdasarkan Tabel Komposisi Pangan Indonesia (TKPI) 2017.
 *       Harga pasar berdasarkan estimasi harga di wilayah Banyuwangi.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Nutrimize database...\n')

  // ============================================================
  // 1. REGIONS — Banyuwangi + surrounding areas
  // ============================================================
  console.log('📍 Seeding regions...')
  const regions = await Promise.all([
    prisma.region.upsert({
      where: { province_city_district: { province: 'Jawa Timur', city: 'Banyuwangi', district: 'Banyuwangi' } },
      update: {},
      create: {
        province: 'Jawa Timur',
        city: 'Banyuwangi',
        district: 'Banyuwangi',
        pihpsCode: '3510',
        lat: -8.2192,
        lng: 114.3691,
      },
    }),
    prisma.region.upsert({
      where: { province_city_district: { province: 'Jawa Timur', city: 'Banyuwangi', district: 'Genteng' } },
      update: {},
      create: {
        province: 'Jawa Timur',
        city: 'Banyuwangi',
        district: 'Genteng',
        lat: -8.3728,
        lng: 114.1536,
      },
    }),
    prisma.region.upsert({
      where: { province_city_district: { province: 'Jawa Timur', city: 'Banyuwangi', district: 'Rogojampi' } },
      update: {},
      create: {
        province: 'Jawa Timur',
        city: 'Banyuwangi',
        district: 'Rogojampi',
        lat: -8.3003,
        lng: 114.2904,
      },
    }),
    prisma.region.upsert({
      where: { province_city_district: { province: 'Jawa Timur', city: 'Banyuwangi', district: 'Muncar' } },
      update: {},
      create: {
        province: 'Jawa Timur',
        city: 'Banyuwangi',
        district: 'Muncar',
        lat: -8.4325,
        lng: 114.3324,
      },
    }),
    prisma.region.upsert({
      where: { province_city_district: { province: 'Jawa Timur', city: 'Banyuwangi', district: 'Kalipuro' } },
      update: {},
      create: {
        province: 'Jawa Timur',
        city: 'Banyuwangi',
        district: 'Kalipuro',
        lat: -8.1671,
        lng: 114.3818,
      },
    }),
  ])
  console.log(`   ✅ ${regions.length} regions created`)

  // ============================================================
  // 2. FOOD CATEGORIES
  // ============================================================
  console.log('🍚 Seeding food categories...')
  const categories = await Promise.all([
    prisma.foodCategory.upsert({
      where: { name: 'Karbohidrat' },
      update: {},
      create: { name: 'Karbohidrat', description: 'Sumber energi utama: nasi, jagung, ubi, sagu, kentang' },
    }),
    prisma.foodCategory.upsert({
      where: { name: 'Protein Hewani' },
      update: {},
      create: { name: 'Protein Hewani', description: 'Daging, ikan, telur, susu, dan hasil olahannya' },
    }),
    prisma.foodCategory.upsert({
      where: { name: 'Protein Nabati' },
      update: {},
      create: { name: 'Protein Nabati', description: 'Tempe, tahu, kacang-kacangan' },
    }),
    prisma.foodCategory.upsert({
      where: { name: 'Sayuran' },
      update: {},
      create: { name: 'Sayuran', description: 'Sumber vitamin, mineral, dan serat' },
    }),
    prisma.foodCategory.upsert({
      where: { name: 'Buah-buahan' },
      update: {},
      create: { name: 'Buah-buahan', description: 'Sumber vitamin C, kalium, dan antioksidan' },
    }),
  ])
  console.log(`   ✅ ${categories.length} food categories created`)

  // ============================================================
  // 3. FOOD ITEMS — Real nutritional data (per 100g)
  // ============================================================
  console.log('🥘 Seeding food items...')
  const foodItemsData = [
    // Karbohidrat
    { name: 'Nasi Putih', categoryId: categories[0].id, calories: 130, protein: 2.7, carbohydrates: 28.2, fat: 0.3, fiber: 0.4, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Nasi putih dari beras lokal Banyuwangi' },
    { name: 'Nasi Merah', categoryId: categories[0].id, calories: 110, protein: 2.6, carbohydrates: 23.5, fat: 0.9, fiber: 1.8, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Beras merah organik lokal' },
    { name: 'Jagung Manis', categoryId: categories[0].id, calories: 86, protein: 3.3, carbohydrates: 19.0, fat: 1.2, fiber: 2.7, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Jagung manis segar dari petani lokal' },
    { name: 'Ubi Jalar Oranye', categoryId: categories[0].id, calories: 86, protein: 1.6, carbohydrates: 20.1, fat: 0.1, fiber: 3.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Ubi jalar oranye kaya beta-karoten' },
    { name: 'Kentang', categoryId: categories[0].id, calories: 77, protein: 2.0, carbohydrates: 17.5, fat: 0.1, fiber: 2.2, unit: 'gram', isLocal: false, localRegions: [], description: 'Kentang segar' },
    { name: 'Mie Telur', categoryId: categories[0].id, calories: 138, protein: 4.5, carbohydrates: 25.2, fat: 1.5, fiber: 1.2, unit: 'gram', isLocal: false, localRegions: [], description: 'Mie telur kering' },

    // Protein Hewani
    { name: 'Ayam Kampung', categoryId: categories[1].id, calories: 239, protein: 27.3, carbohydrates: 0.0, fat: 13.6, fiber: 0.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Daging ayam kampung segar' },
    { name: 'Ikan Tongkol', categoryId: categories[1].id, calories: 109, protein: 24.0, carbohydrates: 0.0, fat: 1.0, fiber: 0.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi', 'Muncar'], description: 'Ikan tongkol segar dari nelayan Muncar' },
    { name: 'Ikan Lele', categoryId: categories[1].id, calories: 95, protein: 18.7, carbohydrates: 0.0, fat: 2.2, fiber: 0.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Ikan lele budidaya lokal' },
    { name: 'Telur Ayam', categoryId: categories[1].id, calories: 155, protein: 12.8, carbohydrates: 1.1, fat: 10.6, fiber: 0.0, unit: 'pcs', isLocal: false, localRegions: [], description: 'Telur ayam ras' },
    { name: 'Ikan Tuna', categoryId: categories[1].id, calories: 132, protein: 28.2, carbohydrates: 0.0, fat: 1.3, fiber: 0.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi', 'Muncar'], description: 'Ikan tuna segar dari pelabuhan Muncar' },
    { name: 'Daging Sapi', categoryId: categories[1].id, calories: 250, protein: 26.1, carbohydrates: 0.0, fat: 15.0, fiber: 0.0, unit: 'gram', isLocal: false, localRegions: [], description: 'Daging sapi segar' },
    { name: 'Udang Segar', categoryId: categories[1].id, calories: 99, protein: 20.9, carbohydrates: 0.2, fat: 1.7, fiber: 0.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi', 'Muncar'], description: 'Udang segar dari tambak lokal' },

    // Protein Nabati
    { name: 'Tempe', categoryId: categories[2].id, calories: 192, protein: 18.5, carbohydrates: 9.4, fat: 10.8, fiber: 1.4, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Tempe kedelai segar dari UMKM lokal' },
    { name: 'Tahu', categoryId: categories[2].id, calories: 76, protein: 8.1, carbohydrates: 1.9, fat: 4.8, fiber: 0.1, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Tahu putih segar' },
    { name: 'Kacang Tanah', categoryId: categories[2].id, calories: 567, protein: 25.8, carbohydrates: 16.1, fat: 49.2, fiber: 8.5, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Kacang tanah lokal' },
    { name: 'Kacang Merah', categoryId: categories[2].id, calories: 333, protein: 23.6, carbohydrates: 60.0, fat: 0.8, fiber: 15.2, unit: 'gram', isLocal: false, localRegions: [], description: 'Kacang merah kering' },
    { name: 'Kacang Hijau', categoryId: categories[2].id, calories: 347, protein: 23.9, carbohydrates: 62.6, fat: 1.2, fiber: 16.3, unit: 'gram', isLocal: false, localRegions: [], description: 'Kacang hijau kering' },

    // Sayuran
    { name: 'Bayam', categoryId: categories[3].id, calories: 23, protein: 2.9, carbohydrates: 3.6, fat: 0.4, fiber: 2.2, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Bayam hijau segar' },
    { name: 'Kangkung', categoryId: categories[3].id, calories: 19, protein: 2.6, carbohydrates: 3.1, fat: 0.2, fiber: 2.1, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Kangkung segar' },
    { name: 'Wortel', categoryId: categories[3].id, calories: 41, protein: 0.9, carbohydrates: 9.6, fat: 0.2, fiber: 2.8, unit: 'gram', isLocal: false, localRegions: [], description: 'Wortel segar' },
    { name: 'Buncis', categoryId: categories[3].id, calories: 31, protein: 1.8, carbohydrates: 7.1, fat: 0.1, fiber: 3.4, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Buncis segar lokal' },
    { name: 'Tomat', categoryId: categories[3].id, calories: 18, protein: 0.9, carbohydrates: 3.9, fat: 0.2, fiber: 1.2, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Tomat merah segar' },
    { name: 'Kol', categoryId: categories[3].id, calories: 25, protein: 1.3, carbohydrates: 5.8, fat: 0.1, fiber: 2.5, unit: 'gram', isLocal: false, localRegions: [], description: 'Kol/kubis putih segar' },
    { name: 'Terong', categoryId: categories[3].id, calories: 25, protein: 1.0, carbohydrates: 6.0, fat: 0.2, fiber: 3.0, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Terong ungu segar' },
    { name: 'Labu Siam', categoryId: categories[3].id, calories: 19, protein: 0.8, carbohydrates: 4.5, fat: 0.1, fiber: 1.7, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Labu siam/jipang segar' },

    // Buah-buahan
    { name: 'Pisang Ambon', categoryId: categories[4].id, calories: 89, protein: 1.1, carbohydrates: 22.8, fat: 0.3, fiber: 2.6, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Pisang ambon lokal' },
    { name: 'Jeruk Siam', categoryId: categories[4].id, calories: 47, protein: 0.9, carbohydrates: 11.7, fat: 0.1, fiber: 2.4, unit: 'pcs', isLocal: true, localRegions: ['Banyuwangi'], description: 'Jeruk siam Banyuwangi' },
    { name: 'Pepaya', categoryId: categories[4].id, calories: 43, protein: 0.5, carbohydrates: 10.8, fat: 0.3, fiber: 1.7, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Pepaya matang segar' },
    { name: 'Semangka', categoryId: categories[4].id, calories: 30, protein: 0.6, carbohydrates: 7.6, fat: 0.2, fiber: 0.4, unit: 'gram', isLocal: false, localRegions: [], description: 'Semangka merah' },
    { name: 'Mangga Harum Manis', categoryId: categories[4].id, calories: 60, protein: 0.8, carbohydrates: 15.0, fat: 0.4, fiber: 1.6, unit: 'gram', isLocal: true, localRegions: ['Banyuwangi'], description: 'Mangga harum manis lokal (seasonal)' },
  ]

  const foodItems: any[] = []
  for (const item of foodItemsData) {
    const created = await prisma.foodItem.upsert({
      where: { id: foodItems.length + 1 },
      update: {},
      create: item,
    })
    foodItems.push(created)
  }
  console.log(`   ✅ ${foodItems.length} food items created`)

  // ============================================================
  // 4. NUTRITION STANDARDS — AKG MBG
  // ============================================================
  console.log('📊 Seeding nutrition standards...')
  const standards = await Promise.all([
    prisma.nutritionStandard.upsert({
      where: { name: 'MBG Makan Siang SD' },
      update: {},
      create: {
        name: 'MBG Makan Siang SD',
        description: 'Standar gizi makan siang untuk siswa Sekolah Dasar (usia 7-12 tahun)',
        minCalories: 550,
        maxCalories: 700,
        minProtein: 12,
        minCarbs: 45,
        maxCarbs: 65,
        minFat: 20,
        maxFat: 35,
        minBudget: 10000,
        maxBudget: 15000,
        source: 'AKG Kemenkes 2019 + Panduan MBG 2024',
      },
    }),
    prisma.nutritionStandard.upsert({
      where: { name: 'MBG Makan Siang SMP' },
      update: {},
      create: {
        name: 'MBG Makan Siang SMP',
        description: 'Standar gizi makan siang untuk siswa Sekolah Menengah Pertama (usia 13-15 tahun)',
        minCalories: 700,
        maxCalories: 900,
        minProtein: 15,
        minCarbs: 45,
        maxCarbs: 65,
        minFat: 20,
        maxFat: 35,
        minBudget: 10000,
        maxBudget: 15000,
        source: 'AKG Kemenkes 2019 + Panduan MBG 2024',
      },
    }),
    prisma.nutritionStandard.upsert({
      where: { name: 'MBG Makan Siang SMA' },
      update: {},
      create: {
        name: 'MBG Makan Siang SMA',
        description: 'Standar gizi makan siang untuk siswa Sekolah Menengah Atas (usia 16-18 tahun)',
        minCalories: 800,
        maxCalories: 1000,
        minProtein: 18,
        minCarbs: 45,
        maxCarbs: 65,
        minFat: 20,
        maxFat: 35,
        minBudget: 10000,
        maxBudget: 15000,
        source: 'AKG Kemenkes 2019 + Panduan MBG 2024',
      },
    }),
  ])
  console.log(`   ✅ ${standards.length} nutrition standards created`)

  // ============================================================
  // 5. USERS — 3 roles
  // ============================================================
  console.log('👤 Seeding users...')
  // Bcrypt hash for password: "nutrimize123" (10 salt rounds)
  // Generated via: await bcrypt.hash('nutrimize123', 10)
  const passwordHash = '$2b$10$ekMBj7WA/7rz66qrlKUt8..Z5hyOxiBKaafxrTmh7Ym3o4LXU00Ia'

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'dapur.bwi@nutrimize.id' },
      update: {},
      create: {
        email: 'dapur.bwi@nutrimize.id',
        passwordHash,
        fullName: 'Siti Aisyah',
        role: 'KITCHEN_MANAGER',
        phone: '08123456789',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'gapoktan.bwi@nutrimize.id' },
      update: {},
      create: {
        email: 'gapoktan.bwi@nutrimize.id',
        passwordHash,
        fullName: 'Pak Ahmad Tani',
        role: 'SUPPLIER',
        phone: '08198765432',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin.dinkes@nutrimize.id' },
      update: {},
      create: {
        email: 'admin.dinkes@nutrimize.id',
        passwordHash,
        fullName: 'Dr. Budi Santoso',
        role: 'GOVERNMENT_ADMIN',
        phone: '08111223344',
        isActive: true,
      },
    }),
  ])
  console.log(`   ✅ ${users.length} users created`)

  // ============================================================
  // 6. SPPG KITCHEN
  // ============================================================
  console.log('🍳 Seeding kitchen...')
  const kitchen = await prisma.sppgKitchen.upsert({
    where: { id: 'kitchen-bwi-001' },
    update: {},
    create: {
      id: 'kitchen-bwi-001',
      userId: users[0].id,
      name: 'Dapur SPPG Banyuwangi Pusat',
      regionId: regions[0].id,
      address: 'Jl. A. Yani No. 45, Kec. Banyuwangi, Kabupaten Banyuwangi',
      lat: -8.2192,
      lng: 114.3691,
      dailyBudget: 12000,
      dailyPortions: 250,
      status: 'OPERATIONAL',
    },
  })
  console.log(`   ✅ Kitchen "${kitchen.name}" created`)

  // ============================================================
  // 7. SUPPLIERS
  // ============================================================
  console.log('🏪 Seeding suppliers...')
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: 'supplier-001' },
      update: {},
      create: {
        id: 'supplier-001',
        userId: users[1].id,
        name: 'Gapoktan Maju Bersama',
        type: 'GAPOKTAN',
        regionId: regions[0].id,
        address: 'Desa Sumberejo, Kec. Banyuwangi',
        lat: -8.2230,
        lng: 114.3550,
        phone: '08198765432',
        description: 'Kelompok tani organik padi, jagung, dan palawija. Sertifikasi organik.',
        isVerified: true,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-002' },
      update: {},
      create: {
        id: 'supplier-002',
        name: 'Nelayan Berkah Muncar',
        type: 'NELAYAN',
        regionId: regions[3].id,
        address: 'Pelabuhan Muncar, Kec. Muncar',
        lat: -8.4350,
        lng: 114.3350,
        phone: '08567891234',
        description: 'Koperasi nelayan Muncar — ikan tongkol, tuna, udang segar harian.',
        isVerified: true,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-003' },
      update: {},
      create: {
        id: 'supplier-003',
        name: 'UMKM Tempe Bu Darmi',
        type: 'UMKM',
        regionId: regions[2].id,
        address: 'Jl. Pasar Rogojampi No. 12',
        lat: -8.3020,
        lng: 114.2920,
        phone: '08789012345',
        description: 'Produsen tempe & tahu segar harian. Kapasitas 50kg/hari.',
        isVerified: true,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-004' },
      update: {},
      create: {
        id: 'supplier-004',
        name: 'Peternakan Ayam Barokah',
        type: 'PETERNAK',
        regionId: regions[1].id,
        address: 'Desa Kembiritan, Kec. Genteng',
        lat: -8.3750,
        lng: 114.1560,
        phone: '08345678901',
        description: 'Peternakan ayam kampung & ras. Telur dan daging segar.',
        isVerified: false,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-005' },
      update: {},
      create: {
        id: 'supplier-005',
        name: 'Toko Sayur Segar Kalipuro',
        type: 'UMKM',
        regionId: regions[4].id,
        address: 'Pasar Kalipuro, Kec. Kalipuro',
        lat: -8.1690,
        lng: 114.3830,
        phone: '08901234567',
        description: 'Distributor sayur dan buah segar harian dari petani lokal.',
        isVerified: true,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-006' },
      update: {},
      create: {
        id: 'supplier-006',
        name: 'Gapoktan Subur Makmur',
        type: 'GAPOKTAN',
        regionId: regions[2].id,
        address: 'Desa Glenmore, Kec. Rogojampi',
        lat: -8.2950,
        lng: 114.2850,
        phone: '08654321098',
        description: 'Kelompok tani kacang tanah, kacang hijau, dan umbi-umbian.',
        isVerified: true,
      },
    }),
  ])
  console.log(`   ✅ ${suppliers.length} suppliers created`)

  // ============================================================
  // 8. SUPPLIER PRODUCTS — Link suppliers to food items with prices
  // ============================================================
  console.log('📦 Seeding supplier products...')
  const supplierProductsData = [
    // Gapoktan Maju Bersama — beras, jagung
    { supplierId: suppliers[0].id, foodItemId: foodItems[0].id, pricePerKg: 12000, stockKg: 500, isAvailable: true },
    { supplierId: suppliers[0].id, foodItemId: foodItems[1].id, pricePerKg: 16000, stockKg: 200, isAvailable: true },
    { supplierId: suppliers[0].id, foodItemId: foodItems[2].id, pricePerKg: 8000, stockKg: 300, isAvailable: true },
    { supplierId: suppliers[0].id, foodItemId: foodItems[3].id, pricePerKg: 7000, stockKg: 150, isAvailable: true },

    // Nelayan Berkah Muncar — seafood
    { supplierId: suppliers[1].id, foodItemId: foodItems[7].id, pricePerKg: 32000, stockKg: 100, isAvailable: true },
    { supplierId: suppliers[1].id, foodItemId: foodItems[10].id, pricePerKg: 45000, stockKg: 80, isAvailable: true },
    { supplierId: suppliers[1].id, foodItemId: foodItems[12].id, pricePerKg: 65000, stockKg: 50, isAvailable: true },

    // UMKM Tempe Bu Darmi — tempe & tahu
    { supplierId: suppliers[2].id, foodItemId: foodItems[13].id, pricePerKg: 16000, stockKg: 50, isAvailable: true },
    { supplierId: suppliers[2].id, foodItemId: foodItems[14].id, pricePerKg: 12000, stockKg: 40, isAvailable: true },

    // Peternakan Ayam Barokah — ayam & telur
    { supplierId: suppliers[3].id, foodItemId: foodItems[6].id, pricePerKg: 38000, stockKg: 75, isAvailable: true },
    { supplierId: suppliers[3].id, foodItemId: foodItems[9].id, pricePerKg: 28000, stockKg: 200, isAvailable: true },

    // Toko Sayur Segar Kalipuro — sayuran & buah
    { supplierId: suppliers[4].id, foodItemId: foodItems[18].id, pricePerKg: 8000, stockKg: 30, isAvailable: true },
    { supplierId: suppliers[4].id, foodItemId: foodItems[19].id, pricePerKg: 6000, stockKg: 40, isAvailable: true },
    { supplierId: suppliers[4].id, foodItemId: foodItems[20].id, pricePerKg: 12000, stockKg: 25, isAvailable: true },
    { supplierId: suppliers[4].id, foodItemId: foodItems[22].id, pricePerKg: 10000, stockKg: 35, isAvailable: true },
    { supplierId: suppliers[4].id, foodItemId: foodItems[26].id, pricePerKg: 15000, stockKg: 50, isAvailable: true },

    // Gapoktan Subur Makmur — kacang-kacangan
    { supplierId: suppliers[5].id, foodItemId: foodItems[15].id, pricePerKg: 24000, stockKg: 100, isAvailable: true },
    { supplierId: suppliers[5].id, foodItemId: foodItems[16].id, pricePerKg: 22000, stockKg: 80, isAvailable: true },
    { supplierId: suppliers[5].id, foodItemId: foodItems[17].id, pricePerKg: 20000, stockKg: 60, isAvailable: true },
  ]

  let spCount = 0
  for (const sp of supplierProductsData) {
    await prisma.supplierProduct.upsert({
      where: { supplierId_foodItemId: { supplierId: sp.supplierId, foodItemId: sp.foodItemId } },
      update: {},
      create: sp,
    })
    spCount++
  }
  console.log(`   ✅ ${spCount} supplier products created`)

  // ============================================================
  // 9. MARKET PRICES — Last 7 days for key items
  // ============================================================
  console.log('💰 Seeding market prices...')
  const today = new Date()
  const keyFoodPrices: Record<number, number> = {
    [foodItems[0].id]: 13000,   // Nasi Putih
    [foodItems[6].id]: 40000,   // Ayam Kampung
    [foodItems[7].id]: 35000,   // Ikan Tongkol
    [foodItems[9].id]: 30000,   // Telur Ayam
    [foodItems[13].id]: 18000,  // Tempe
    [foodItems[14].id]: 14000,  // Tahu
    [foodItems[18].id]: 10000,  // Bayam
    [foodItems[20].id]: 14000,  // Wortel
  }

  let mpCount = 0
  for (const [foodItemId, basePrice] of Object.entries(keyFoodPrices)) {
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date(today)
      date.setDate(date.getDate() - dayOffset)
      date.setHours(0, 0, 0, 0)

      // Add realistic price fluctuation ±5%
      const fluctuation = 1 + (Math.random() - 0.5) * 0.1
      const price = Math.round(basePrice * fluctuation)

      await prisma.marketPrice.upsert({
        where: {
          foodItemId_regionId_priceDate: {
            foodItemId: Number(foodItemId),
            regionId: regions[0].id,
            priceDate: date,
          },
        },
        update: { pricePerKg: price },
        create: {
          foodItemId: Number(foodItemId),
          regionId: regions[0].id,
          pricePerKg: price,
          priceDate: date,
          source: 'PIHPS',
        },
      })
      mpCount++
    }
  }
  console.log(`   ✅ ${mpCount} market price records created`)

  // ============================================================
  // 10. DAILY MENUS — Last 5 days
  // ============================================================
  console.log('📋 Seeding daily menus...')
  const menuData = [
    {
      dayOffset: 4,
      packageName: 'Paket Nutrisi A',
      mainDish: 'Ayam Woku Kemangi',
      totalCalories: 845,
      totalProtein: 28.5,
      totalCarbs: 58.2,
      totalFat: 18.3,
      costPerPortion: 11500,
      portions: 250,
      status: 'EVALUATED' as const,
      isAiOptimized: true,
      items: [
        { foodItemIdx: 0, quantityGrams: 200, cost: 2600 },   // Nasi Putih 200g
        { foodItemIdx: 6, quantityGrams: 80, cost: 3200 },    // Ayam Kampung 80g
        { foodItemIdx: 13, quantityGrams: 50, cost: 900 },    // Tempe 50g
        { foodItemIdx: 18, quantityGrams: 75, cost: 750 },    // Bayam 75g
        { foodItemIdx: 22, quantityGrams: 50, cost: 500 },    // Tomat 50g
        { foodItemIdx: 26, quantityGrams: 100, cost: 1500 },  // Pisang Ambon 100g
      ],
    },
    {
      dayOffset: 3,
      packageName: 'Paket Nutrisi B',
      mainDish: 'Tongkol Bumbu Kuning',
      totalCalories: 810,
      totalProtein: 32.1,
      totalCarbs: 55.0,
      totalFat: 15.8,
      costPerPortion: 10800,
      portions: 250,
      status: 'EVALUATED' as const,
      isAiOptimized: true,
      items: [
        { foodItemIdx: 0, quantityGrams: 200, cost: 2600 },   // Nasi Putih 200g
        { foodItemIdx: 7, quantityGrams: 100, cost: 3500 },   // Ikan Tongkol 100g
        { foodItemIdx: 14, quantityGrams: 50, cost: 700 },    // Tahu 50g
        { foodItemIdx: 19, quantityGrams: 75, cost: 450 },    // Kangkung 75g
        { foodItemIdx: 22, quantityGrams: 40, cost: 400 },    // Tomat 40g
        { foodItemIdx: 28, quantityGrams: 100, cost: 430 },   // Pepaya 100g
      ],
    },
    {
      dayOffset: 2,
      packageName: 'Paket Nutrisi C',
      mainDish: 'Lele Goreng Sambal Matah',
      totalCalories: 790,
      totalProtein: 26.8,
      totalCarbs: 52.5,
      totalFat: 19.2,
      costPerPortion: 10200,
      portions: 250,
      status: 'SERVED' as const,
      isAiOptimized: true,
      isSubstituted: true,
      substitutionReason: 'Harga ayam naik 15%, substitusi ke ikan lele yang lebih terjangkau dan tetap memenuhi target protein.',
      items: [
        { foodItemIdx: 0, quantityGrams: 200, cost: 2600 },   // Nasi Putih 200g
        { foodItemIdx: 8, quantityGrams: 120, cost: 2400 },   // Ikan Lele 120g
        { foodItemIdx: 13, quantityGrams: 50, cost: 900 },    // Tempe 50g
        { foodItemIdx: 21, quantityGrams: 60, cost: 500 },    // Buncis 60g
        { foodItemIdx: 20, quantityGrams: 40, cost: 560 },    // Wortel 40g
        { foodItemIdx: 27, quantityGrams: 80, cost: 380 },    // Jeruk Siam 80g
      ],
    },
    {
      dayOffset: 1,
      packageName: 'Paket Nutrisi D',
      mainDish: 'Pecel Tempe Sayur Komplit',
      totalCalories: 780,
      totalProtein: 24.3,
      totalCarbs: 60.1,
      totalFat: 16.5,
      costPerPortion: 9800,
      portions: 250,
      status: 'CONFIRMED' as const,
      isAiOptimized: true,
      items: [
        { foodItemIdx: 1, quantityGrams: 200, cost: 3200 },   // Nasi Merah 200g
        { foodItemIdx: 13, quantityGrams: 100, cost: 1800 },  // Tempe 100g
        { foodItemIdx: 9, quantityGrams: 55, cost: 1540 },    // Telur Ayam 55g (1 butir)
        { foodItemIdx: 18, quantityGrams: 50, cost: 500 },    // Bayam 50g
        { foodItemIdx: 21, quantityGrams: 50, cost: 420 },    // Buncis 50g
        { foodItemIdx: 15, quantityGrams: 20, cost: 480 },    // Kacang Tanah 20g (bumbu pecel)
      ],
    },
    {
      dayOffset: 0,
      packageName: 'Paket Nutrisi E',
      mainDish: 'Tuna Rica-Rica',
      totalCalories: 860,
      totalProtein: 35.2,
      totalCarbs: 54.8,
      totalFat: 17.1,
      costPerPortion: 12200,
      portions: 250,
      status: 'DRAFT' as const,
      isAiOptimized: true,
      recipeGuide: '1. Cuci bersih ikan tuna, potong dadu 3cm. 2. Tumis bumbu rica-rica (cabai, bawang merah, bawang putih, jahe, serai). 3. Masukkan tuna, aduk rata. 4. Tambah air secukupnya, masak hingga bumbu meresap. 5. Sajikan dengan nasi putih, sayur bayam bening, dan pisang.',
      items: [
        { foodItemIdx: 0, quantityGrams: 200, cost: 2600 },   // Nasi Putih 200g
        { foodItemIdx: 10, quantityGrams: 100, cost: 4500 },  // Ikan Tuna 100g
        { foodItemIdx: 14, quantityGrams: 50, cost: 700 },    // Tahu 50g
        { foodItemIdx: 18, quantityGrams: 60, cost: 600 },    // Bayam 60g
        { foodItemIdx: 24, quantityGrams: 50, cost: 450 },    // Terong 50g
        { foodItemIdx: 26, quantityGrams: 100, cost: 1500 },  // Pisang Ambon 100g
      ],
    },
  ]

  const menus: any[] = []
  for (const menu of menuData) {
    const menuDate = new Date(today)
    menuDate.setDate(menuDate.getDate() - menu.dayOffset)
    menuDate.setHours(0, 0, 0, 0)

    const created = await prisma.dailyMenu.upsert({
      where: { kitchenId_menuDate: { kitchenId: kitchen.id, menuDate } },
      update: {},
      create: {
        kitchenId: kitchen.id,
        menuDate,
        packageName: menu.packageName,
        mainDish: menu.mainDish,
        totalCalories: menu.totalCalories,
        totalProtein: menu.totalProtein,
        totalCarbs: menu.totalCarbs,
        totalFat: menu.totalFat,
        costPerPortion: menu.costPerPortion,
        totalCost: menu.costPerPortion * menu.portions,
        portions: menu.portions,
        isAiOptimized: menu.isAiOptimized,
        isSubstituted: menu.isSubstituted ?? false,
        substitutionReason: menu.substitutionReason ?? null,
        recipeGuide: menu.recipeGuide ?? null,
        status: menu.status,
      },
    })

    // Create menu items
    for (let i = 0; i < menu.items.length; i++) {
      const item = menu.items[i]
      await prisma.menuItem.upsert({
        where: { menuId_foodItemId: { menuId: created.id, foodItemId: foodItems[item.foodItemIdx].id } },
        update: {},
        create: {
          menuId: created.id,
          foodItemId: foodItems[item.foodItemIdx].id,
          quantityGrams: item.quantityGrams,
          cost: item.cost,
          displayOrder: i + 1,
        },
      })
    }

    menus.push(created)
  }
  console.log(`   ✅ ${menus.length} daily menus created (with items)`)

  // ============================================================
  // 11. WASTE LOGS — for evaluated menus
  // ============================================================
  console.log('♻️ Seeding waste logs...')
  const evaluatedMenus = menus.filter((_, i) => menuData[i].status === 'EVALUATED')
  let wlCount = 0

  for (let mi = 0; mi < evaluatedMenus.length; mi++) {
    const menu = evaluatedMenus[mi]
    const menuDate = new Date(today)
    menuDate.setDate(menuDate.getDate() - menuData[mi].dayOffset)
    menuDate.setHours(0, 0, 0, 0)

    const items = menuData[mi].items
    for (const item of items) {
      // Realistic waste: protein items low waste, carbs medium, vegs higher
      const category = foodItems[item.foodItemIdx].categoryId
      let wasteBase: number
      if (category === categories[0].id) wasteBase = 12     // Karbohidrat: ~12%
      else if (category === categories[1].id) wasteBase = 8  // Protein Hewani: ~8%
      else if (category === categories[2].id) wasteBase = 10 // Protein Nabati: ~10%
      else if (category === categories[3].id) wasteBase = 18 // Sayuran: ~18%
      else wasteBase = 15                                     // Buah: ~15%

      const waste = Math.max(0, Math.min(100, wasteBase + (Math.random() - 0.5) * 10))

      await prisma.wasteLog.upsert({
        where: { menuId_foodItemId: { menuId: menu.id, foodItemId: foodItems[item.foodItemIdx].id } },
        update: {},
        create: {
          menuId: menu.id,
          foodItemId: foodItems[item.foodItemIdx].id,
          wastePercentage: Number(waste.toFixed(2)),
          logDate: menuDate,
          notes: waste > 25 ? 'Sisa cukup tinggi — perlu perhatian' : null,
        },
      })
      wlCount++
    }
  }
  console.log(`   ✅ ${wlCount} waste log entries created`)

  // ============================================================
  // 12. PURCHASE ORDERS — for confirmed/served menus
  // ============================================================
  console.log('🛒 Seeding purchase orders...')
  const po1 = await prisma.purchaseOrder.upsert({
    where: { id: 'po-001' },
    update: {},
    create: {
      id: 'po-001',
      menuId: menus[2].id,
      kitchenId: kitchen.id,
      supplierId: suppliers[0].id,
      orderDate: (() => { const d = new Date(today); d.setDate(d.getDate() - 3); d.setHours(0,0,0,0); return d })(),
      totalAmount: 650000,
      status: 'DELIVERED',
      sentVia: 'WHATSAPP',
    },
  })
  await prisma.purchaseOrderItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      orderId: po1.id,
      foodItemId: foodItems[0].id,
      quantityKg: 50,
      pricePerKg: 13000,
      subtotal: 650000,
    },
  })

  const po2 = await prisma.purchaseOrder.upsert({
    where: { id: 'po-002' },
    update: {},
    create: {
      id: 'po-002',
      menuId: menus[2].id,
      kitchenId: kitchen.id,
      supplierId: suppliers[1].id,
      orderDate: (() => { const d = new Date(today); d.setDate(d.getDate() - 3); d.setHours(0,0,0,0); return d })(),
      totalAmount: 960000,
      status: 'DELIVERED',
      sentVia: 'WHATSAPP',
    },
  })
  await prisma.purchaseOrderItem.upsert({
    where: { id: 2 },
    update: {},
    create: {
      orderId: po2.id,
      foodItemId: foodItems[8].id,
      quantityKg: 30,
      pricePerKg: 32000,
      subtotal: 960000,
    },
  })

  const po3 = await prisma.purchaseOrder.upsert({
    where: { id: 'po-003' },
    update: {},
    create: {
      id: 'po-003',
      menuId: menus[4].id,
      kitchenId: kitchen.id,
      supplierId: suppliers[1].id,
      orderDate: (() => { const d = new Date(today); d.setHours(0,0,0,0); return d })(),
      totalAmount: 1125000,
      status: 'PENDING',
      sentVia: 'WHATSAPP',
    },
  })
  await prisma.purchaseOrderItem.upsert({
    where: { id: 3 },
    update: {},
    create: {
      orderId: po3.id,
      foodItemId: foodItems[10].id,
      quantityKg: 25,
      pricePerKg: 45000,
      subtotal: 1125000,
    },
  })

  console.log(`   ✅ 3 purchase orders created (with items)`)

  // ============================================================
  // DONE
  // ============================================================
  console.log('\n🎉 Seeding complete! Database is ready.\n')
  console.log('📊 Summary:')
  console.log(`   • ${regions.length} regions`)
  console.log(`   • ${categories.length} food categories`)
  console.log(`   • ${foodItems.length} food items`)
  console.log(`   • ${standards.length} nutrition standards`)
  console.log(`   • ${users.length} users`)
  console.log(`   • 1 kitchen`)
  console.log(`   • ${suppliers.length} suppliers`)
  console.log(`   • ${spCount} supplier products`)
  console.log(`   • ${mpCount} market price records`)
  console.log(`   • ${menus.length} daily menus`)
  console.log(`   • ${wlCount} waste logs`)
  console.log(`   • 3 purchase orders`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
