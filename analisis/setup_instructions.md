# 🛠️ Instruksi Setup Environment — Nutrimize

## Arsitektur yang Akan Kita Bangun

```
nutrimize/
├── Next.js (Frontend + API Routes/BFF) ← Scope ANDA
│   ├── Prisma ORM → PostgreSQL
│   └── Calls AI microservice
│
└── FastAPI (AI Microservice) ← Scope TEMAN
    ├── Google OR-Tools (CSP Solver)
    └── Gemini Pro API (LLM)
```

> Next.js API Routes bertindak sebagai **Backend-for-Frontend (BFF)** yang handle semua CRUD, auth, dan komunikasi ke AI service.

---

## Step 1: Cek Prerequisites

Pastikan sudah terinstall di mesin Anda:

```powershell
# Cek Node.js (minimal v18+)
node -v

# Cek npm
npm -v

# Cek PostgreSQL
psql --version
```

> [!IMPORTANT]
> Jika PostgreSQL belum terinstall, download dari https://www.postgresql.org/download/windows/
> Saat instalasi, catat **username**, **password**, dan **port** (default: 5432).

---

## Step 2: Buat Database PostgreSQL

Buka terminal/PowerShell dan jalankan:

```powershell
# Login ke PostgreSQL (ganti 'postgres' dengan username Anda)
psql -U postgres

# Di dalam psql shell, jalankan:
CREATE DATABASE nutrimize;

# Verifikasi
\l

# Keluar
\q
```

Catat connection string Anda:
```
postgresql://postgres:PASSWORD_ANDA@localhost:5432/nutrimize
```

---

## Step 3: Inisialisasi Project Next.js

```powershell
# Masuk ke folder project
# Pastikan Anda di: d:\PIDI\nutrimize

# Inisialisasi Next.js (dengan TypeScript, App Router, Tailwind CSS)
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

> [!NOTE]
> Flag `./` membuat project di directory saat ini (bukan subfolder baru).
> Jika ada file lain di folder (mockup, arsitektur, dll), Next.js biasanya tetap bisa init. Tapi jika error, pindahkan file-file tersebut sementara.

Setelah selesai, struktur folder akan jadi:
```
d:\PIDI\nutrimize\
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── ...
```

---

## Step 4: Install Prisma

```powershell
# Install Prisma CLI dan client
npm install prisma --save-dev
npm install @prisma/client

# Inisialisasi Prisma (akan buat folder prisma/ dan .env)
npx prisma init
```

Setelah ini, akan muncul:
```
nutrimize/
├── prisma/
│   └── schema.prisma    ← Kita akan isi ini
├── .env                 ← Connection string di sini
└── ...
```

---

## Step 5: Konfigurasi `.env`

Buka file `.env` dan isi:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/nutrimize?schema=public"
```

> Ganti `PASSWORD_ANDA` dengan password PostgreSQL Anda.

---

## Step 6: Tulis Prisma Schema

Buka file `prisma/schema.prisma` dan **ganti seluruh isinya** dengan schema berikut:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTH & USERS
// ============================================

enum UserRole {
  KITCHEN_MANAGER
  SUPPLIER
  GOVERNMENT_ADMIN
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  fullName     String   @map("full_name")
  role         UserRole
  phone        String?
  avatarUrl    String?  @map("avatar_url")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  // Relations
  kitchens  SppgKitchen[]
  supplier  Supplier?

  @@map("users")
}

// ============================================
// LOCATION
// ============================================

model Region {
  id        Int     @id @default(autoincrement())
  province  String
  city      String
  district  String?                              // Kecamatan
  pihpsCode String? @map("pihps_code")           // Kode wilayah PIHPS API
  lat       Decimal? @db.Decimal(10, 7)
  lng       Decimal? @db.Decimal(10, 7)

  // Relations
  kitchens     SppgKitchen[]
  suppliers    Supplier[]
  marketPrices MarketPrice[]

  @@unique([province, city, district])
  @@map("regions")
}

// ============================================
// KITCHEN (SPPG)
// ============================================

enum KitchenStatus {
  OPERATIONAL
  INACTIVE
  MAINTENANCE
}

model SppgKitchen {
  id            String        @id @default(uuid())
  userId        String        @map("user_id")
  name          String                                // "Dapur SPPG Banyuwangi"
  regionId      Int           @map("region_id")
  address       String?
  lat           Decimal?      @db.Decimal(10, 7)
  lng           Decimal?      @db.Decimal(10, 7)
  dailyBudget   Int           @default(10000) @map("daily_budget")   // Rp per porsi
  dailyPortions Int           @default(250) @map("daily_portions")
  status        KitchenStatus @default(OPERATIONAL)
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  // Relations
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  region         Region          @relation(fields: [regionId], references: [id])
  dailyMenus     DailyMenu[]
  purchaseOrders PurchaseOrder[]

  @@map("sppg_kitchens")
}

// ============================================
// FOOD DATA
// ============================================

model FoodCategory {
  id          Int     @id @default(autoincrement())
  name        String  @unique                        // Karbohidrat, Protein Hewani, dll
  description String?

  // Relations
  foodItems FoodItem[]

  @@map("food_categories")
}

model FoodItem {
  id            Int      @id @default(autoincrement())
  name          String
  categoryId    Int      @map("category_id")
  calories      Decimal  @db.Decimal(8, 2)            // per 100g
  protein       Decimal  @db.Decimal(8, 2)            // per 100g (gram)
  carbohydrates Decimal  @db.Decimal(8, 2)            // per 100g (gram)
  fat           Decimal  @db.Decimal(8, 2)            // per 100g (gram)
  fiber         Decimal  @default(0) @db.Decimal(8, 2)
  unit          String   @default("gram")             // gram, pcs, ml
  isLocal       Boolean  @default(false) @map("is_local")
  localRegions  String[] @map("local_regions")        // Array of region names
  description   String?
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  category         FoodCategory       @relation(fields: [categoryId], references: [id])
  menuItems        MenuItem[]
  wasteLogs        WasteLog[]
  marketPrices     MarketPrice[]
  supplierProducts SupplierProduct[]
  poItems          PurchaseOrderItem[]

  @@index([categoryId])
  @@map("food_items")
}

// ============================================
// NUTRITION STANDARDS (AKG BGN)
// ============================================

model NutritionStandard {
  id              Int     @id @default(autoincrement())
  name            String  @unique                     // "MBG Makan Siang SD", "MBG Makan Siang SMP"
  description     String?
  minCalories     Decimal @map("min_calories") @db.Decimal(8, 2)   // 800
  maxCalories     Decimal @map("max_calories") @db.Decimal(8, 2)   // 900
  minProtein      Decimal @map("min_protein") @db.Decimal(8, 2)    // 15
  minCarbs        Decimal @map("min_carbs") @db.Decimal(8, 2)      // Persentase bawah: 45%
  maxCarbs        Decimal @map("max_carbs") @db.Decimal(8, 2)      // Persentase atas: 65%
  minFat          Decimal? @map("min_fat") @db.Decimal(8, 2)
  maxFat          Decimal? @map("max_fat") @db.Decimal(8, 2)
  minBudget       Int     @map("min_budget")                       // 10000
  maxBudget       Int     @map("max_budget")                       // 15000
  isActive        Boolean @default(true) @map("is_active")
  source          String  @default("AKG Kemenkes 2019")            // Sumber regulasi
  createdAt       DateTime @default(now()) @map("created_at")

  @@map("nutrition_standards")
}

// ============================================
// SUPPLIERS & MARKETPLACE
// ============================================

enum SupplierType {
  GAPOKTAN
  UMKM
  NELAYAN
  PETERNAK
  OTHER
}

model Supplier {
  id          String       @id @default(uuid())
  userId      String?      @unique @map("user_id")   // NULL if not registered as user
  name        String
  type        SupplierType
  regionId    Int          @map("region_id")
  address     String?
  lat         Decimal?     @db.Decimal(10, 7)
  lng         Decimal?     @db.Decimal(10, 7)
  phone       String?                                 // WhatsApp number
  description String?
  isVerified  Boolean      @default(false) @map("is_verified")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  user           User?           @relation(fields: [userId], references: [id])
  region         Region          @relation(fields: [regionId], references: [id])
  products       SupplierProduct[]
  purchaseOrders PurchaseOrder[]

  @@index([regionId])
  @@index([type])
  @@map("suppliers")
}

model SupplierProduct {
  id          Int      @id @default(autoincrement())
  supplierId  String   @map("supplier_id")
  foodItemId  Int      @map("food_item_id")
  pricePerKg  Int      @map("price_per_kg")           // Rp
  stockKg     Decimal? @map("stock_kg") @db.Decimal(10, 2)
  isAvailable Boolean  @default(true) @map("is_available")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  supplier Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  foodItem FoodItem @relation(fields: [foodItemId], references: [id])

  @@unique([supplierId, foodItemId])
  @@map("supplier_products")
}

// ============================================
// MARKET PRICES (PIHPS CACHE)
// ============================================

model MarketPrice {
  id         Int      @id @default(autoincrement())
  foodItemId Int      @map("food_item_id")
  regionId   Int      @map("region_id")
  pricePerKg Int      @map("price_per_kg")             // Rp
  priceDate  DateTime @map("price_date") @db.Date
  source     String   @default("PIHPS")
  createdAt  DateTime @default(now()) @map("created_at")

  // Relations
  foodItem FoodItem @relation(fields: [foodItemId], references: [id])
  region   Region   @relation(fields: [regionId], references: [id])

  @@unique([foodItemId, regionId, priceDate])
  @@index([priceDate(sort: Desc)])
  @@index([regionId, priceDate(sort: Desc)])
  @@map("market_prices")
}

// ============================================
// DAILY MENUS (AI OUTPUT)
// ============================================

enum MenuStatus {
  DRAFT
  CONFIRMED
  SERVED
  EVALUATED
}

model DailyMenu {
  id               String     @id @default(uuid())
  kitchenId        String     @map("kitchen_id")
  menuDate         DateTime   @map("menu_date") @db.Date
  packageName      String?    @map("package_name")        // "Paket Nutrisi A"
  mainDish         String?    @map("main_dish")            // "Ayam Woku Kemangi"

  // Nutrition totals (per porsi)
  totalCalories    Decimal?   @map("total_calories") @db.Decimal(8, 2)
  totalProtein     Decimal?   @map("total_protein") @db.Decimal(8, 2)
  totalCarbs       Decimal?   @map("total_carbs") @db.Decimal(8, 2)
  totalFat         Decimal?   @map("total_fat") @db.Decimal(8, 2)

  // Cost
  costPerPortion   Int?       @map("cost_per_portion")
  totalCost        Int?       @map("total_cost")
  portions         Int?

  // AI metadata
  isAiOptimized       Boolean  @default(false) @map("is_ai_optimized")
  isSubstituted       Boolean  @default(false) @map("is_substituted")
  substitutionReason  String?  @map("substitution_reason")
  optimizationTimeMs  Int?     @map("optimization_time_ms")
  recipeGuide         String?  @map("recipe_guide")        // Gemini-generated

  status           MenuStatus @default(DRAFT)
  scheduleTime     String     @default("12:00") @map("schedule_time")
  createdAt        DateTime   @default(now()) @map("created_at")
  updatedAt        DateTime   @updatedAt @map("updated_at")

  // Relations
  kitchen        SppgKitchen     @relation(fields: [kitchenId], references: [id])
  menuItems      MenuItem[]
  wasteLogs      WasteLog[]
  purchaseOrders PurchaseOrder[]

  @@unique([kitchenId, menuDate])
  @@index([kitchenId, menuDate(sort: Desc)])
  @@map("daily_menus")
}

model MenuItem {
  id            Int     @id @default(autoincrement())
  menuId        String  @map("menu_id")
  foodItemId    Int     @map("food_item_id")
  quantityGrams Decimal @map("quantity_grams") @db.Decimal(8, 2)  // Takaran per porsi
  cost          Int?                                               // Biaya per porsi
  displayOrder  Int     @default(0) @map("display_order")

  // Relations
  menu     DailyMenu @relation(fields: [menuId], references: [id], onDelete: Cascade)
  foodItem FoodItem  @relation(fields: [foodItemId], references: [id])

  @@unique([menuId, foodItemId])
  @@map("menu_items")
}

// ============================================
// WASTE TRACKING (FEEDBACK LOOP)
// ============================================

model WasteLog {
  id              Int      @id @default(autoincrement())
  menuId          String   @map("menu_id")
  foodItemId      Int      @map("food_item_id")
  wastePercentage Decimal  @map("waste_percentage") @db.Decimal(5, 2)  // 0-100
  logDate         DateTime @map("log_date") @db.Date
  notes           String?
  createdAt       DateTime @default(now()) @map("created_at")

  // Relations
  menu     DailyMenu @relation(fields: [menuId], references: [id])
  foodItem FoodItem  @relation(fields: [foodItemId], references: [id])

  @@unique([menuId, foodItemId])
  @@index([logDate(sort: Desc)])
  @@map("waste_logs")
}

// ============================================
// PURCHASE ORDERS
// ============================================

enum POStatus {
  PENDING
  SENT
  CONFIRMED
  DELIVERED
  CANCELLED
}

model PurchaseOrder {
  id          String   @id @default(uuid())
  menuId      String?  @map("menu_id")
  kitchenId   String   @map("kitchen_id")
  supplierId  String   @map("supplier_id")
  orderDate   DateTime @map("order_date") @db.Date
  totalAmount Int?     @map("total_amount")           // Total Rp
  status      POStatus @default(PENDING)
  sentVia     String   @default("WHATSAPP") @map("sent_via")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  menu     DailyMenu?          @relation(fields: [menuId], references: [id])
  kitchen  SppgKitchen         @relation(fields: [kitchenId], references: [id])
  supplier Supplier            @relation(fields: [supplierId], references: [id])
  items    PurchaseOrderItem[]

  @@map("purchase_orders")
}

model PurchaseOrderItem {
  id         Int     @id @default(autoincrement())
  orderId    String  @map("order_id")
  foodItemId Int     @map("food_item_id")
  quantityKg Decimal @map("quantity_kg") @db.Decimal(10, 2)
  pricePerKg Int     @map("price_per_kg")
  subtotal   Int

  // Relations
  order    PurchaseOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)
  foodItem FoodItem      @relation(fields: [foodItemId], references: [id])

  @@map("purchase_order_items")
}
```

---

## Step 7: Jalankan Migration

Setelah schema selesai ditulis, jalankan:

```powershell
# Generate migration pertama
npx prisma migrate dev --name init

# Ini akan:
# 1. Membuat tabel di PostgreSQL
# 2. Generate Prisma Client
# 3. Buat folder prisma/migrations/
```

Jika berhasil, Anda akan lihat output:
```
✓ Generated Prisma Client
✓ The database is now in sync with your schema
```

---

## Step 8: Verifikasi dengan Prisma Studio

```powershell
# Buka Prisma Studio (GUI untuk lihat database)
npx prisma studio
```

Ini akan membuka browser di `http://localhost:5555` — Anda bisa melihat semua tabel sudah terbuat.

---

## Step 9: Setup Prisma Client Singleton (untuk Next.js)

Buat file `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

> [!NOTE]
> Ini mencegah Next.js membuat koneksi database baru setiap kali hot-reload di development.

---

## ✅ Checklist

Setelah mengikuti semua step, pastikan:

- [ ] PostgreSQL running & database `nutrimize` sudah dibuat
- [ ] Next.js project ter-inisialisasi di `d:\PIDI\nutrimize`
- [ ] Prisma terinstall & `schema.prisma` terisi
- [ ] Migration berhasil (`npx prisma migrate dev --name init`)
- [ ] Prisma Studio bisa dibuka dan menampilkan semua 14 tabel
- [ ] File `src/lib/prisma.ts` sudah dibuat

---

## 🔜 Langkah Setelah Ini

Setelah environment siap, kita akan lanjut ke:
1. **Seed Data** — Isi data demo Banyuwangi (regions, food items, suppliers, nutrition standards)
2. **API Routes** — CRUD endpoints di Next.js App Router
3. **Frontend Pages** — Mulai dari Dashboard
