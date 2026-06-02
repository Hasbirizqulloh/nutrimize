-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('KITCHEN_MANAGER', 'SUPPLIER', 'GOVERNMENT_ADMIN');

-- CreateEnum
CREATE TYPE "KitchenStatus" AS ENUM ('OPERATIONAL', 'INACTIVE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('GAPOKTAN', 'UMKM', 'NELAYAN', 'PETERNAK', 'OTHER');

-- CreateEnum
CREATE TYPE "MenuStatus" AS ENUM ('DRAFT', 'CONFIRMED', 'SERVED', 'EVALUATED');

-- CreateEnum
CREATE TYPE "POStatus" AS ENUM ('PENDING', 'SENT', 'CONFIRMED', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" SERIAL NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "pihps_code" TEXT,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sppg_kitchens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region_id" INTEGER NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "daily_budget" INTEGER NOT NULL DEFAULT 10000,
    "daily_portions" INTEGER NOT NULL DEFAULT 250,
    "status" "KitchenStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sppg_kitchens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "food_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "calories" DECIMAL(8,2) NOT NULL,
    "protein" DECIMAL(8,2) NOT NULL,
    "carbohydrates" DECIMAL(8,2) NOT NULL,
    "fat" DECIMAL(8,2) NOT NULL,
    "fiber" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'gram',
    "is_local" BOOLEAN NOT NULL DEFAULT false,
    "local_regions" TEXT[],
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrition_standards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "min_calories" DECIMAL(8,2) NOT NULL,
    "max_calories" DECIMAL(8,2) NOT NULL,
    "min_protein" DECIMAL(8,2) NOT NULL,
    "min_carbs" DECIMAL(8,2) NOT NULL,
    "max_carbs" DECIMAL(8,2) NOT NULL,
    "min_fat" DECIMAL(8,2),
    "max_fat" DECIMAL(8,2),
    "min_budget" INTEGER NOT NULL,
    "max_budget" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'AKG Kemenkes 2019',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nutrition_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "type" "SupplierType" NOT NULL,
    "region_id" INTEGER NOT NULL,
    "address" TEXT,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "phone" TEXT,
    "description" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_products" (
    "id" SERIAL NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "price_per_kg" INTEGER NOT NULL,
    "stock_kg" DECIMAL(10,2),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" SERIAL NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "price_per_kg" INTEGER NOT NULL,
    "price_date" DATE NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'PIHPS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_menus" (
    "id" TEXT NOT NULL,
    "kitchen_id" TEXT NOT NULL,
    "menu_date" DATE NOT NULL,
    "package_name" TEXT,
    "main_dish" TEXT,
    "total_calories" DECIMAL(8,2),
    "total_protein" DECIMAL(8,2),
    "total_carbs" DECIMAL(8,2),
    "total_fat" DECIMAL(8,2),
    "cost_per_portion" INTEGER,
    "total_cost" INTEGER,
    "portions" INTEGER,
    "is_ai_optimized" BOOLEAN NOT NULL DEFAULT false,
    "is_substituted" BOOLEAN NOT NULL DEFAULT false,
    "substitution_reason" TEXT,
    "optimization_time_ms" INTEGER,
    "recipe_guide" TEXT,
    "status" "MenuStatus" NOT NULL DEFAULT 'DRAFT',
    "schedule_time" TEXT NOT NULL DEFAULT '12:00',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" SERIAL NOT NULL,
    "menu_id" TEXT NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "quantity_grams" DECIMAL(8,2) NOT NULL,
    "cost" INTEGER,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waste_logs" (
    "id" SERIAL NOT NULL,
    "menu_id" TEXT NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "waste_percentage" DECIMAL(5,2) NOT NULL,
    "log_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waste_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT,
    "kitchen_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "order_date" DATE NOT NULL,
    "total_amount" INTEGER,
    "status" "POStatus" NOT NULL DEFAULT 'PENDING',
    "sent_via" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "food_item_id" INTEGER NOT NULL,
    "quantity_kg" DECIMAL(10,2) NOT NULL,
    "price_per_kg" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "regions_province_city_district_key" ON "regions"("province", "city", "district");

-- CreateIndex
CREATE UNIQUE INDEX "food_categories_name_key" ON "food_categories"("name");

-- CreateIndex
CREATE INDEX "food_items_category_id_idx" ON "food_items"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "nutrition_standards_name_key" ON "nutrition_standards"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_user_id_key" ON "suppliers"("user_id");

-- CreateIndex
CREATE INDEX "suppliers_region_id_idx" ON "suppliers"("region_id");

-- CreateIndex
CREATE INDEX "suppliers_type_idx" ON "suppliers"("type");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_products_supplier_id_food_item_id_key" ON "supplier_products"("supplier_id", "food_item_id");

-- CreateIndex
CREATE INDEX "market_prices_price_date_idx" ON "market_prices"("price_date" DESC);

-- CreateIndex
CREATE INDEX "market_prices_region_id_price_date_idx" ON "market_prices"("region_id", "price_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "market_prices_food_item_id_region_id_price_date_key" ON "market_prices"("food_item_id", "region_id", "price_date");

-- CreateIndex
CREATE INDEX "daily_menus_kitchen_id_menu_date_idx" ON "daily_menus"("kitchen_id", "menu_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "daily_menus_kitchen_id_menu_date_key" ON "daily_menus"("kitchen_id", "menu_date");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_menu_id_food_item_id_key" ON "menu_items"("menu_id", "food_item_id");

-- CreateIndex
CREATE INDEX "waste_logs_log_date_idx" ON "waste_logs"("log_date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "waste_logs_menu_id_food_item_id_key" ON "waste_logs"("menu_id", "food_item_id");

-- AddForeignKey
ALTER TABLE "sppg_kitchens" ADD CONSTRAINT "sppg_kitchens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sppg_kitchens" ADD CONSTRAINT "sppg_kitchens_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_items" ADD CONSTRAINT "food_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "food_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_prices" ADD CONSTRAINT "market_prices_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_prices" ADD CONSTRAINT "market_prices_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_menus" ADD CONSTRAINT "daily_menus_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "sppg_kitchens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "daily_menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_logs" ADD CONSTRAINT "waste_logs_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "daily_menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waste_logs" ADD CONSTRAINT "waste_logs_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "daily_menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_kitchen_id_fkey" FOREIGN KEY ("kitchen_id") REFERENCES "sppg_kitchens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_food_item_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
