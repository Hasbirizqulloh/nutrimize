# Nutrimize: SaaS ERP & B2B AI-Aggregator for Precision Nutrition

[![Tech Stack](https://img.shields.io/badge/Stack-Python_FastAPI_%7C_Next.js_%7C_GCP-blue)](https://github.com/Hasbirizqulloh/nutrimize)
[![AI Engine](https://img.shields.io/badge/AI-Google_OR--Tools_%2B_Gemini_Pro-orange)]()
[![Status](https://img.shields.io/badge/Status-Prototype-green)]()

**Nutrimize** adalah platform *Enterprise Resource Planning* (ERP) berbasis kecerdasan buatan yang dirancang sebagai asisten manajerial operasional bagi Satuan Pelayanan Pemenuhan Gizi (SPPG) dalam mengeksekusi Program Makan Bergizi Gratis (MBG).

## 📌 Problem Statement: Operasional "Trilema"
Pengelola SPPG menghadapi tantangan harian yang kompleks dalam memenuhi mandat pemerintah:
1.  **Standar Gizi Presisi:** Pemenuhan 800-900 kkal dan protein >15g secara konsisten.
2.  **Batasan Anggaran Ketat:** Harga Pokok Produksi (HPP) harus terkunci di Rp10.000 - Rp15.000 per porsi di tengah inflasi harga pangan.
3.  **Kepatuhan Lokal:** Mandat penyerapan 70% bahan baku dari UMKM/Petani lokal tingkat kecamatan.
4.  **Innefisiensi Audit:** Risiko gagal pencairan dana operasional (*Auto Top-Up*) akibat pelaporan faktur manual yang rentan kesalahan.

## 🚀 Solusi Utama (3 Pilar MVP)
Nutrimize mengintegrasikan tiga modul komputasi utama:
*   **Multi-Target AI CSP Optimizer:** Menggunakan algoritma *Constraint Satisfaction Problem* (Google OR-Tools) untuk meracik menu gizi presisi dengan biaya terendah dalam <100ms.
*   **B2B Matchmaking & Auto-Reconciliation:** Menghubungkan dapur langsung ke petani/UMKM lokal dan mengonversi transaksi digital menjadi log audit (HACCP) otomatis.
*   **Smart Waste Tracker:** Menciptakan *feedback loop* dari data sisa makanan untuk merekayasa perbaikan menu pada siklus berikutnya, bertujuan menekan *food waste* hingga 30%.

## 🛠️ Arsitektur Teknologi
Sistem dibangun dengan arsitektur *asynchronous microservices* di atas **Google Cloud Platform (GCP)**:
*   **Backend:** Python FastAPI (untuk integrasi AI yang *high-performance*).
*   **Frontend:** Next.js (Web Dashboard responsif).
*   **AI Engine:** 
    *   **Google OR-Tools:** Optimasi matematis batasan gizi dan anggaran harian.
    *   **Gemini Pro:** *Dynamic substitution* bahan pangan saat inflasi dan integrasi bahasa natural.
*   **Database:** PostgreSQL (Cloud SQL).
*   **Data Integration:** Real-time API PIHPS Nasional (Bank Indonesia) untuk pembaruan harga pangan harian.

## 📊 Metrik Keberhasilan (SMART Goals)
*   **Cost Efficiency:** Mengunci HPP absolut di bawah **Rp15.000/porsi** tanpa kompromi nutrisi.
*   **Compliance:** Mencapai **100% kepatuhan** administrasi penyerapan 70% bahan lokal via faktur PO digital.
*   **Waste Reduction:** Menurunkan volume *food waste* operasional sebesar **30%** dalam satu bulan pertama.
*   **Scalability:** Arsitektur mampu menangani **5.000 akses serentak** dengan respons <5 detik.

## 📈 Roadmap Pengembangan (Agile Methodology)
*   **Sprint 1-2:** Fondasi arsitektur Backend & integrasi API PIHPS.
*   **Sprint 3-6:** Implementasi mesin optimasi AI CSP & Gemini Pro.
*   **Sprint 7-8:** Pengembangan modul B2B Marketplace & Pelacakan Sisa Makanan.
*   **Sprint 9-10:** Uji coba operasional perintis (*Pilot Project*) pada 3-5 dapur SPPG.

## 👥 Tim Nalarwangsa
1.  **Alpian Khairi** – *Team Lead, Data Scientist & AI/MLOps Engineer*.
2.  **Moh Hasbi Rizqulloh** – *Full Stack Engineer & AI Developer*.
