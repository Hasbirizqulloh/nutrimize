DRAFTING 2ND SUBMISSION PROPOSAL DIGDAYA x HACKATHON 2026

Team Identity	
Team ID	
P0736
Team Name	
Nalarwangsa

Team Composition
Proposal Title	
Nutrimize: Otomatisasi Menu Cerdas & B2B Matchmaking UMKM Lokal untuk Efisiensi Operasional Satuan Pelayanan Pemenuhan Gizi

Team Composition
Sebutkan nama ketua dan anggota, serta peran masing-masing dalam project ini.
Alpian Khairi (Team Lead, Data Scientist, AI & MLOps Engineer, System Analyst)
Bertanggung jawab merancang dan mengoptimasi model algoritma kecerdasan buatan (AI CSP Optimizer & LLM) serta arsitektur komputasi awan.
Moh Hasbi Rizqulloh (Full Stack Engineer & Data Analyst)
Bertanggung jawab mengembangkan antarmuka sistem terintegrasi (SaaS ERP) dan merekayasa jalur data (data pipeline) dari hulu ke hilir
.



Executive Summary	
Jelaskan versi terbaru dari solusi Anda, termasuk problem utama, pendekatan solusi, dan dampak utama yang ditargetkan. Highlight perubahan/penajaman dari sebelumnya.
Pengelola Satuan Pelayanan Pemenuhan Gizi (SPPG) menghadapi masalah kritis: kerentanan manipulasi administrasi dan inefisiensi perencanaan hulu. Penggunaan spreadsheet manual membuka celah mark-up harga faktur dan memicu kegagalan audit pelaporan, yang berakibat fatal pada tertundanya pencairan dana reimbursement.
Untuk memutus rantai kerentanan tersebut, Nutrimize hadir sebagai SaaS ERP dan upstream copilot. Sistem ini mengintegrasikan Multi-Target AI CSP Optimizer untuk merancang resep gizi dengan Harga Pokok Produksi (HPP) terkunci mutlak maksimal Rp10.000 per porsi, yang otomatis dikonversi menjadi pesanan belanja langsung ke ekosistem UMKM lokal. Seluruh transaksi kemudian disinkronkan menjadi log pelaporan audit baku yang kebal manipulasi.
Secara terukur, intervensi sistem hulu ini menjamin 100% kelancaran audit pencairan dana SPPG, memangkas beban waktu administrasi secara drastis, menekan food waste hingga 30%, serta memastikan transparansi perputaran ekonomi UMKM.




Problem Alignment & Refinement	
Problem Statement
Sesuai dengan penulisan Problem Statement yang sesuai.
PENINGKATAN PRODUKTIVITAS, KETAHANAN PANGAN, DAN PENCIPTAAN LAPANGAN KERJA.

Primary Sub-Problem Statement
Sesuai dengan penulisan Sub-Problem Statement yang sesuai, boleh lebih dari 1.
Digitalisasi Ketahanan Pangan.

Problem Validation
Apa masalah inti yang Anda selesaikan saat ini? Jelaskan perubahan atau penajaman dari proposal sebelumnya, termasuk akar masalah. Hindari menjelaskan masalah yang terlalu umum.
Sebagai penajaman dari proposal tahap pertama yang mendefinisikan masalah secara makro sebagai "trilema operasional harian", kami kini memfokuskan ulang akar masalah pada realita lapangan yang lebih spesifik: kerentanan manipulasi administrasi dan inefisiensi di fase perencanaan hulu Satuan Pelayanan Pemenuhan Gizi (SPPG).
Berdasarkan Petunjuk Teknis Badan Gizi Nasional (BGN), SPPG wajib meracik resep multi-target dengan pagu mutlak at cost sebesar Rp8.000,00 hingga Rp10.000,00 per porsi, lalu melaporkannya ke portal Sistem Dialur untuk mencairkan dana reimbursement. Namun, ketiadaan decision-support system memaksa pengelola SPPG mengandalkan spreadsheet manual seperti fail FOOD COST.xlsx untuk kalkulasi gizi dan rekapitulasi ratusan nota UMKM.
Sistem usang ini tidak hanya menyita waktu berjam-jam, tetapi juga membuka celah mark-up harga faktur belanja karena ketiadaan validasi harga riil. Kesalahan fatal pada rekapitulasi ini berujung pada penolakan laporan di portal BGN. Imbasnya sangat kritis: pencairan dana tertunda, modal kerja terkuras, dan operasional dapur SPPG terancam lumpuh.





Problem–Solution Mapping
Jelaskan secara eksplisit hubungan antara problem → mekanisme solusi → outcome yang dihasilkan dengan alur yang jelas.
Untuk mengeliminasi kerentanan tersebut, Nutrimize hadir sebagai upstream copilot berbasis Software as a Service (SaaS) yang beroperasi sebelum data diunggah ke sistem pemerintah. Kompleksitas kalkulasi gizi diselesaikan melalui Kalkulator Gizi AI yang secara asinkron meracik menu multi-target  (siswa, ibu hamil, ibu menyusui, balita) sekaligus mengunci Harga Pokok Produksi (HPP) mutlak di bawah batas Rp10.000,00 per porsi. Resep tersebut diteruskan ke fitur Pasar Logistik UMKM yang secara otomatis mengonversi matriks gizi menjadi purchase order kepada mitra pemasok lokal. Transaksi ini langsung terekonsiliasi menjadi format laporan baku yang bebas manipulasi harga dan siap diekspor ke portal Dialur BGN. Terintegrasi dengan fitur Smart Waste Tracker untuk mengevaluasi resep yang kurang diminati, solusi ini secara terukur mampu mengamankan kelancaran audit pencairan dana, memangkas 80% beban administrasi, dan menekan food waste hingga 30%.

Ecosystem Alignment
Bagaimana solusi Anda berinteraksi dengan stakeholder, regulasi, dan sistem yang sudah ada? Sebutkan pihak dengan jelas dan batasan yang nyata.
Sistem Nutrimize diposisikan sebagai infrastruktur komplementer dalam ekosistem Program Makan Bergizi Gratis (MBG). Secara sistemik, platform ini mendukung regulator melalui penyediaan export connector yang mentransfer data terstruktur langsung ke portal pengawasan wajib BGN, seperti Sistem Dialur dan Rapor MBG, sehingga mencegah tumpang tindih pelaporan. Solusi ini mengorkestrasi sinergi antara pengelola SPPG sebagai pengguna utama dan UMKM pangan lokal binaan Pusat Layanan Usaha Terpadu (PLUT) sebagai mitra pemasok. Log audit digital yang terekonsiliasi dan bebas dari anomali harga akan memperlancar tata kelola birokrasi Bank Himbara dalam mengeksekusi pencairan dana kepada SPPG. Dari sisi arsitektur bisnis, implementasi ini berpegang teguh pada model asset-light, di mana Nutrimize murni beroperasi sebagai penyedia infrastruktur perangkat lunak tanpa perlu mengakuisisi aset logistik fisik.


Solution & Impact Deep Dive	
Solution Approach & Mechanism
Jelaskan bagaimana solusi bekerja secara end-to-end (input → proses → output), dengan fokus pada penajaman dari proposal sebelumnya.
Nutrimize menajamkan solusi dari sekadar platform agregator menjadi lapisan perencanaan hulu (upstream copilot) yang mengekspor data pelaporan ke sistem wajib pemerintah, yakni Sistem Dialur. Secara operasional, pengelola Satuan Pelayanan Pemenuhan Gizi (SPPG) berinteraksi melalui satu antarmuka dasbor tunggal. Alur kerja dimulai ketika pengguna memasukkan profil penerima manfaat ke dalam sistem, yang secara paralel menarik data harga pasar dari Pusat Informasi Harga Pangan Strategis (PIHPS) melalui rekayasa pipeline ekstraksi data, dilengkapi opsi input survei manual tingkat kecamatan.
Data tersebut kemudian diproses secara asinkron oleh mesin algoritma optimasi (Constraint Satisfaction Problem) untuk mengalkulasi presisi gizi berbagai sasaran secara serentak, sekaligus mengunci Harga Pokok Produksi (HPP) maksimal Rp10.000,00 per porsi at cost. Saat terjadi inflasi harga di luar toleransi, Kecerdasan Buatan Generatif (Large Language Model) memberikan rekomendasi substitusi bahan lokal termurah dengan kesetaraan gizi. Hasil akhir dari aliran komputasi ini adalah resep terstandardisasi dan pesanan pembelian ke UMKM lokal. Seluruh nota transaksi otomatis terekonsiliasi menjadi format laporan audit yang sah, sehingga menjamin SPPG lolos pengawasan Badan Gizi Nasional (BGN) demi kelancaran pencairan dana reimbursement.
.


Impact Scale & Targets
Apa dampak dari utama solusi Anda? Jelaskan skala dampak (berdasarkan jumlah pengguna/instansi) dan manfaat yang dihasilkan.
Dampak utama Nutrimize adalah menyelamatkan kelangsungan operasional SPPG dari ancaman penundaan dana reimbursement akibat kegagalan audit administrasi, sekaligus menggerakkan roda inklusi ekonomi pedesaan. Skala dampak ini diproyeksikan untuk menyasar tiga pilar ekosistem Program Makan Bergizi Gratis secara nasional:
Pengelola SPPG: Menargetkan ekspansi bertahap menuju total target pasar (total addressable market) sebanyak 29.225 SPPG di seluruh Indonesia. Manfaat utamanya adalah memangkas beban waktu perencanaan gizi dan rekapitulasi administrasi pelaporan, serta mengeliminasi risiko pembekuan modal kerja dapur.
Petani dan UMKM Pangan: Solusi ini memberdayakan rantai pasok lokal yang saat ini melibatkan 142.387 pemasok, termasuk di antaranya 59.921 UMKM dan 13.306 unit koperasi. Ekosistem Nutrimize memastikan kepastian serapan panen, memotong jalur tengkulak, dan mengakselerasi penciptaan 1,2 juta lapangan kerja di sekitar dapur SPPG.
Penerima Manfaat: Mendukung kelancaran distribusi nutrisi presisi bagi 62,45 juta penerima manfaat (siswa, balita, ibu hamil) tanpa kompromi penurunan kualitas gizi dan isu buang anggaran meskipun terjadi fluktuasi harga bahan pokok di pasar lokal.

Impact Measurement
Bagaimana Anda mengukur keberhasilan solusi? Sebutkan indikator kuantitatif dengan menggunakan angka dan
Keberhasilan Nutrimize diukur menggunakan kerangka evaluasi SMART (Specific, Measurable, Achievable, Relevant, Time-bound) melalui lima indikator kuantitatif utama pada fase implementasi perintis (proof of concept):
Kelulusan Audit dan Kelancaran Dana: Mencapai 100% tingkat keberhasilan lolos audit pelaporan di Sistem Dialur BGN tanpa revisi pada SPPG pengguna, sehingga dana reimbursement cair tepat waktu pada setiap siklus pencairan.
Efisiensi Waktu Operasional: Menurunkan beban waktu penyusunan resep gizi berbagai sasaran dan rekapitulasi faktur belanja UMKM sebesar 80%, dari berjam-jam menggunakan lembar kerja (spreadsheet) manual menjadi di bawah 30 detik melalui otomasi aplikasi.
Kepatuhan Anggaran Absolut: Memastikan 100% Harga Pokok Produksi (HPP) menu harian terkunci mutlak pada rentang harga perolehan (at cost) sebesar Rp8.000,00 hingga Rp10.000,00 per porsi sesuai indeks kemahalan daerah, tanpa melanggar standar Angka Kecukupan Gizi (AKG).
Inklusi Ekonomi Lokal: Memfasilitasi pertumbuhan nilai transaksi bruto (gross merchandise value) serapan pangan langsung dari puluhan ribu UMKM binaan dan kelompok tani lokal yang menjadi penyuplai bahan baku segar dapur SPPG.
Reduksi Pemborosan Pangan: Menurunkan volume sisa makanan (food waste) sebesar 30% pada akhir siklus produksi melalui mekanisme rekayasa menu adaptif dari fitur Pelacak Sisa Makanan Pintar (Smart Waste Tracker).


System & Public Value Proposition
Bagaimana solusi memberikan nilai terhadap sistem yang lebih luas? (Dapat berupa efisiensi, inklusi, risk reduction, dll)
Sistem Nutrimize tidak hanya menyelamatkan operasional harian SPPG secara individu, tetapi memberikan nilai publik (public value) berskala makro sebagai infrastruktur transparansi data nasional. Bagi regulator seperti BGN, jejak audit digital (audit trail) dari platform ini memfasilitasi pencegahan manipulasi (mark-up) faktur pembelanjaan karena sistem terintegrasi dengan parameter harga pasar sesungguhnya. Integritas data ini secara preventif menekan risiko kebocoran Anggaran Pendapatan dan Belanja Negara (APBN).
Dari perspektif inklusi kesejahteraan, Nutrimize mentransformasikan beban biaya program sosial menjadi instrumen pendorong efek pengganda ekonomi. Dengan memastikan perputaran modal triliunan rupiah dari 29.225 SPPG terserap langsung ke urat nadi ekonomi desa, sistem ini mengukuhkan kedaulatan pangan lokal sekaligus memerdekakan pelaku usaha mikro dari praktik tata niaga tengkulak yang merugikan.
.


Innovation & Differentiation	
Solution Originality
Apa yang benar-benar baru dari solusi Anda dibandingkan pendekatan yang sudah ada? Jelaskan dengan lebih rinci dibandingkan proposal sebelumnya.
Inovasi orisinal Nutrimize terletak pada reposisi strategisnya sebagai upstream copilot, bukan sekadar platform pencatatan pasif. Saat ini, lanskap digital didominasi oleh platform hilir milik pemerintah seperti Sistem Dialur dan Rapor MBG yang berfungsi murni sebagai wadah pelaporan, serta penggunaan spreadsheet usang untuk perhitungan manual di dapur. Nutrimize memecahkan kebuntuan tersebut melalui hyper-local menu engineering. Sistem ini memampukan setiap SPPG menyusun substitusi bahan secara dinamis sesuai kearifan lokal tanpa melanggar standar Angka Kecukupan Gizi dan pagu at cost maksimal Rp10.000,00 per porsi. Kebaruan ini menjadikan Nutrimize sebagai satu-satunya sistem yang menyelaraskan standar gizi, daya beli desa, dan kelancaran birokrasi secara preventif tanpa menduplikasi aplikasi pengawasan pemerintah.

Technological / Method Innovation
Apa pendekatan teknis/metodologi unik yang digunakan?
Nutrimize mengimplementasikan arsitektur komputasi hibrida asinkron di dalam ekosistem microservices. Secara metodologis, sistem mengekstrak data fluktuasi harga pasar melalui pipeline Extract, Transform, Load (ETL) dari Pusat Informasi Harga Pangan Strategis, yang diperkuat dengan fallback input survei manual tingkat kecamatan. Data tersebut diproses oleh algoritma optimasi matematis Constraint Satisfaction Problem yang secara simultan mengunci fungsi objektif harga at cost dan rentang kalori multi-target dengan kecepatan komputasi di bawah 100 milidetik. Keunikan utama terletak pada mekanisme function calling berbasis Large Language Model. Ketika algoritma mendeteksi inflasi harga di atas ambang batas, sistem secara otomatis mengeksekusi dynamic substitution guna merekomendasikan bahan pangan alternatif termurah dengan kesetaraan nutrisi absolut.
Creativity in Implementation
Bagaimana pendekatan Anda dalam distribusi, monetisasi, atau user engagement berbeda dari yang sudah ada?
Kreativitas implementasi berpusat pada penciptaan switching cost yang tinggi melalui model monetisasi Business-to-Business-to-Government berskema freemium. Distribusi produk diposisikan secara strategis sebagai infrastruktur kepatuhan ekosistem. SPPG dapat menggunakan fitur kalkulator gizi secara gratis, namun diwajibkan berlangganan fitur premium untuk mengotomatisasi konversi nota UMKM menjadi laporan baku. Untuk memitigasi hambatan literasi digital di tingkat pemasok pedesaan, sistem mengeliminasi keharusan petani mengunduh aplikasi baru. Seluruh notifikasi purchase order dieksekusi secara langsung melalui WhatsApp Business API. Strategi akuisisi pengguna digerakkan secara kolektif melalui kemitraan dengan Pusat Layanan Usaha Terpadu UMKM sebagai agregator lapangan, yang secara signifikan menekan biaya operasional hingga titik terendah.




Technical Validation	
System Architecture
Jelaskan desain arsitektur solusi Anda (termasuk komponen utama & alur sistem).
Sistem dibangun dengan arsitektur microservices yang bertumpu pada infrastruktur komputasi awan termutakhir untuk menjamin skalabilitas masif. Lapisan antarmuka pengguna dikembangkan menggunakan framework Next.js guna menghasilkan dasbor web yang sangat responsif bagi pengelola SPPG. Pada lapisan belakang, sistem menggunakan FastAPI untuk memproses pertukaran data secara asinkron yang terintegrasi dengan basis data relasional PostgreSQL. Otak komputasi menggabungkan Google OR-Tools untuk mengeksekusi algoritma optimasi gizi dan Gemini Pro untuk memberikan rekomendasi substitusi cerdas. Aliran informasi logistik diotomatisasi melalui WhatsApp Business API untuk mempercepat transmisi purchase order bahan pangan segar kepada UMKM pemasok secara seketika tanpa hambatan latensi.

Data & Feasibility
Data apa yang digunakan? Dari mana sumbernya? Apakah realistis untuk diakses dan digunakan?
Kelayakan implementasi terjamin karena sistem bergantung pada orkestrasi data yang validitasnya diakui oleh negara. Nutrimize mengagregasi tiga lapisan data utama: standar gizi turunan Kementerian Kesehatan, indeks harga pangan dari portal pemerintah yang diekstraksi melalui pipeline ETL, serta data masukan historis dari Smart Waste Tracker sebagai feedback loop bagi algoritma. Untuk memitigasi ketiadaan integrasi API PIHPS secara langsung dari server pemerintah, arsitektur data dilengkapi dengan fitur input harga pasar manual tingkat lokal dan mekanisme caching pangkalan data sementara. Hal ini memastikan kecerdasan buatan tetap beroperasi meracik menu harian secara optimal tanpa terganggu oleh isu putusnya konektivitas jaringan.

Security & Compliance
Bagaimana solusi Anda menangani keamanan data dan kepatuhan regulasi?
Sebagai infrastruktur kepatuhan operasional, keamanan dan ketaatan hukum merupakan prioritas mutlak. Seluruh format kalkulasi gizi dan rekapitulasi faktur diselaraskan sepenuhnya dengan standar instrumen audit BGN serta protokol Hazard Analysis and Critical Control Points. Untuk mereduksi risiko penyelewengan dana negara, platform mengadaptasi sistem Role-Based Access Control yang memisahkan hak akses staf pengadaan sebagai maker dari Kepala SPPG sebagai approver. Seluruh arus data transaksi dan rekam jejak pengguna dilindungi melalui skema enkripsi penuh di dalam pusat data yang berlokasi di wilayah Indonesia, guna mematuhi regulasi kedaulatan data dan Undang-Undang Pelindungan Data Pribadi.

Implementation Readiness (MVP)
Apa scope MVP Anda dan apakah realistis untuk dibangun dalam waktu dekat (jangka enam bulan sampai satu tahun kedepan)?
Peluncuran Minimum Viable Product dirancang secara rasional untuk dieksekusi dalam siklus 12 minggu menggunakan metodologi agile. Ruang lingkup produk dibatasi secara ketat pada tiga modul penyelamat kepatuhan audit: Kalkulator Gizi AI, Pasar Logistik UMKM, dan Dasbor Smart Waste Tracker. Tahapan eksekusi dibagi menjadi tiga milestone esensial. Bulan pertama difokuskan pada pembangunan fondasi arsitektur lapisan belakang dan integrasi basis data. Bulan kedua dialokasikan untuk melatih algoritma komputasi matematis dan menyempurnakan interaksi antarmuka pengguna. Bulan ketiga ditargetkan untuk pelaksanaan proof of concept pada lima dapur SPPG percontohan. Target absolut pengujian ini adalah mencapai tingkat keberhasilan 100% kelolosan audit pelaporan pada Sistem Dialur tanpa revisi.


Business Model & Scalability	
Value Proposition
Apa nilai utama yang diterima oleh pengguna dalam menggunakan solusi yang Anda usulkan?
Nutrimize memberikan tiga nilai utama bagi pengelola Satuan Pelayanan Pemenuhan Gizi (SPPG) dalam menjalankan operasional dan memenuhi persyaratan kepatuhan Badan Gizi Nasional (BGN). Pertama, proteksi finansial. Kalkulator Gizi AI secara otomatis menyusun menu multi-target dan mengunci Harga Pokok Produksi (HPP) bahan baku agar tetap berada dalam pagu at cost yang ditetapkan pemerintah, yaitu Rp8.000 per porsi untuk balita hingga siswa sekolah dasar kelas tiga dan Rp10.000 per porsi untuk siswa sekolah dasar kelas empat ke atas hingga ibu menyusui. Hal ini membantu mencegah defisit operasional akibat kesalahan perencanaan menu dan fluktuasi harga pangan.
Kedua, efisiensi administrasi dan kepatuhan. Nutrimize mengotomatisasi rekapitulasi faktur belanja, pencatatan pengadaan lokal, serta dokumentasi audit menjadi format terstruktur yang siap diekspor ke sistem pelaporan pemerintah seperti Dialur dan Rapor MBG. Proses yang sebelumnya dilakukan secara manual melalui spreadsheet menjadi lebih cepat, akurat, dan minim risiko human error.
Ketiga, peningkatan kualitas operasional. Sistem memanfaatkan data harga pangan dan pola konsumsi untuk menghasilkan rekomendasi resep yang adaptif, membantu menekan food waste hingga 30% serta meningkatkan pemanfaatan bahan pangan lokal sesuai mandat program. Bagi UMKM dan petani, Nutrimize menciptakan transparansi permintaan dan kepastian serapan hasil produksi dalam rantai pasok pangan daerah.

Model Revenue / Funding 
Bagaimana solusi menghasilkan revenue atau mendapatkan pendanaan? Jelaskan dengan ekspilit dan transparan.
Untuk mengakselerasi tingkat adopsi masif secara nasional, Nutrimize membebaskan biaya langganan (100% gratis) bagi pengelola SPPG. Keberlanjutan finansial kami bertumpu pada tiga arus pendapatan B2B dan B2G yang adil:
Platform Fee (Sisi Pemasok): Pemotongan komisi transaksi mikro (take-rate) sebesar 1,5% yang dibebankan eksklusif kepada pemasok (UMKM/Petani) atas keberhasilan konversi transaksi logistik, sebagai nilai tukar atas kepastian serapan pasar.
Financial API Partnership (B2B): Bertindak murni sebagai penyedia skor kredit alternatif, Nutrimize menyuplai histori lolos audit SPPG ke Bank Himbara guna memitigasi risiko pembiayaan. Kami memperoleh referral fee 10-12% dari margin bank atas pencairan dana talangan, mutlak tanpa membebani SPPG dengan bunga platform.
Data-as-a-Service / Government Payer (B2G): Monetisasi infrastruktur data melalui lisensi Dasbor Analitik Makro. Badan Gizi Nasional (BGN) dan Pemerintah Daerah bertindak sebagai Government Payer yang membayar biaya langganan tahunan melalui e-Katalog LKPP. Lisensi ini dibeli untuk mendapatkan visibilitas hulu secara real-time atas kepatuhan gizi dan serapan pangan lokal guna mencegah kebocoran anggaran negara.

Cost Structure & Sustainability
Apa komponen biaya utama dan bagaimana solusi dapat berkelanjutan secara finansial? Jelaskan prediksi Anda secara nyata.
Komponen biaya operasional Nutrimize dialokasikan secara efisien untuk memelihara infrastruktur Data-as-a-Service (DaaS) berskala nasional. Komponen utamanya meliputi: biaya server/cloud (Google Cloud Platform), integrasi API pihak ketiga (Gemini LLM, WhatsApp Business, API Perbankan), gaji tim engineering, serta kepatuhan keamanan data. Biaya Akuisisi Pelanggan (CAC) ditekan ke titik terendah karena aplikasi SPPG bersifat gratis dan diakuisisi melalui kemitraan strategis dengan PLUT-UMKM.
Keberlanjutan finansial (sustainability) dipastikan melalui tiga landasan:
Pendekatan Asset-Light: Kami beroperasi murni sebagai penyedia perangkat lunak tanpa beban pemeliharaan aset fisik seperti gudang atau armada logistik yang rawan memicu pembengkakan biaya (burn rate).
Biaya Marjinal Nol: Arsitektur multi-tenant di komputasi awan membuat biaya penambahan SPPG baru mendekati angka nol. Hal ini memungkinkan biaya operasional tertutup sepenuhnya melalui subsidi silang dari komisi take-rate pemasok dan referral fee bank.
Data Network Effect: Sentralisasi histori audit menciptakan switching cost yang tinggi bagi SPPG. Semakin masif data kepatuhan yang diproses, semakin tinggi pula nilai komersial Dasbor Analitik B2G yang kami lisensikan, sehingga mengunci Badan Gizi Nasional (BGN) sebagai pelanggan jangkar (anchor payer) yang menjamin arus kas jangka panjang.

Scalability
Bagaimana solusi dapat berkembang ke skala yang lebih besar?
Skalabilitas Nutrimize ditopang oleh arsitektur microservices asinkron di cloud yang memungkinkan replikasi sistem seketika (horizontal scaling) tanpa hambatan latensi. Potensi ekspansi sangat masif, menargetkan adopsi nasional terhadap 33.000 SPPG yang melayani 82,9 juta penerima manfaat.
Faktor pendukung utama ekspansi ini adalah algoritma AI kami yang bersifat parametrik. Ekspansi dari pilot di Banyuwangi ke provinsi lain tidak memerlukan perombakan sistem; cukup mengganti dataset fluktuasi harga lokal (PIHPS) dan profil pangan endemik daerah tersebut. Dikombinasikan dengan operasional tanpa aset fisik (asset-light), biaya lokalisasi berhasil ditekan hingga mendekati nol.
Agar tidak berhenti di skala kecil, dua hal krusial yang kami persiapkan meliputi:
Kesiapan Infrastruktur Integrasi: Pemeliharaan stabilitas jalur Open API dengan bank mitra (untuk otomatisasi pembiayaan) dan pendaftaran produk ke e-Katalog LKPP agar siap dibeli oleh Pemerintah.
Kemitraan Edukasi (PLUT-UMKM): Penyiapan kerangka kerja sama dengan PLUT daerah sebagai agen fasilitator lapangan untuk mendampingi inklusi digital SPPG dan Petani/UMKM, guna menekan biaya akuisisi pengguna (CAC).

 




Partnership & Distribution
Bagaimana strategi distribusi dan peran mitra dalam implementasi solusi? Sebutkan mitra potensial yang Anda ketahui.
Strategi kemitraan Nutrimize mengorkestrasi ekosistem dari hulu ke hilir untuk memastikan adopsi yang inklusif dan berkelanjutan. Di lini hulu, kami menggandeng Badan Gizi Nasional (BGN), Kementerian Kesehatan, dan Bapanas sebagai regulator penentu standar gizi serta penyedia pangkalan data fluktuasi harga pasar. Untuk memperkuat rantai pasok, Pusat Layanan Usaha Terpadu (PLUT-UMKM) bertindak sebagai fasilitator lapangan guna mengakselerasi digitalisasi lebih dari 59.000 UMKM dan 13.000 koperasi pedesaan. Secara paralel, kami bermitra dengan Bank Himbara ataupun Bank lainnya sebagai penyedia likuiditas modal kerja bersubsidi bagi SPPG dan UMKM dengan memanfaatkan skor kredit alternatif dari platform kami.
Strategi distribusi dieksekusi melalui pendekatan multisektor. SPPG diakuisisi secara organik berkat daya tarik perangkat lunak operasional yang diakses sepenuhnya gratis. Sementara itu, penetrasi ke segmen Pemerintah Daerah dan BGN dilakukan melalui pendistribusian lisensi dasbor analitik makro secara resmi di e-Katalog LKPP. Pada tingkat akar rumput, notifikasi pesanan bahan baku didistribusikan langsung kepada pemasok lokal melalui WhatsApp Business API guna memitigasi rendahnya literasi digital tanpa mengharuskan instalasi aplikasi baru.



Market Validation	
Problem–Market Fit
Mengapa masalah ini penting dan mendesak bagi target pengguna Anda?
Masalah ini sangat mendesak karena keberlangsungan operasional Satuan Pelayanan Pemenuhan Gizi (SPPG) bergantung mutlak pada kelancaran pencairan dana reimbursement dari pemerintah. Apabila pengelola gagal merancang resep dengan pagu at cost maksimal Rp10.000,00 per porsi, serta salah merekapitulasi ratusan faktur manual akibat kerentanan spreadsheet, laporan mereka akan ditolak oleh portal Sistem Dialur. Penolakan administratif ini berakibat fatal: pencairan dana termin akan tertunda, yang berujung pada defisit modal kerja, kelumpuhan operasional dapur SPPG, dan terhentinya atau berkurangnya pasokan gizi bagi penerima manfaat secara massal.

Evidence of Demand
Apa bukti bahwa solusi ini dibutuhkan? (Jelaskan melalui hasil survey, interview, data, dll)
Tingginya kebutuhan atas solusi ini tervalidasi oleh krisis operasional dan kerentanan tata kelola di lapangan. Secara kuantitatif per Mei 2026, terdapat 29.225 SPPG yang melayani 62,45 juta penerima manfaat dan bertransaksi harian dengan 142.387 pemasok lokal. Volume masif ini menjadi bencana administratif saat murni dikelola menggunakan spreadsheet manual. Secara kualitatif, temuan pengawasan lapangan membuktikan bahwa kelemahan sistem manual memicu praktik manipulasi dan mark-up harga faktur belanja, seperti harga ayam Rp50.000,00 dicatat menjadi Rp55.000,00 akibat tidak adanya validasi harga pada waktu nyata. Kerentanan rekapitulasi ini berujung pada penolakan laporan di sistem pemerintah yang menahan pencairan dana reimbursement. Dampak fatal dari inefisiensi ini terbukti pada kasus SPPG Kalibata yang harus menanggung akumulasi kerugian likuiditas hingga Rp975.375.000,00 tanpa pembayaran sepeser pun dari pemerintah, yang bermuara pada ancaman kebangkrutan. Fakta ini menegaskan bahwa pengelola SPPG sangat mendesak membutuhkan upstream copilot untuk mengotomatisasi Harga Pokok Produksi dan merekonsiliasi faktur secara presisi, guna mengamankan audit dan modal kerja harian.
Target Market
Siapa target market utama Anda dan dalam konteks apa solusi digunakan (misalnya terkait peran, situasi, atau kebutuhan)? Jelaskan secara spesifik.
Target pasar Nutrimize terdiri atas tiga segmentasi spesifik dalam ekosistem Business-to-Business-to-Government (B2B2G). Pengguna utama adalah pengelola dan pengawas keuangan SPPG di tingkat daerah yang bertugas meracik resep gizi multi-target dan merekapitulasi nota belanja untuk keperluan audit BGN. Target pengguna sekunder pada sisi pasokan adalah 142.387 pemasok, yang mencakup 59.921 UMKM dan 13.306 koperasi desa binaan Pusat Layanan Usaha Terpadu (PLUT) di sekitar lokasi SPPG. Adapun target pelanggan tingkat korporasi adalah BGN dan pemerintah daerah yang membutuhkan lisensi dasbor analitik makro untuk memantau rasio serapan pangan lokal dan mencegah fraud secara preventif.

Adoption Readiness
Seberapa mudah solusi Anda diadopsi oleh pengguna? Apa tantangan adopsinya?
Kesiapan adopsi oleh pengelola SPPG tergolong sangat tinggi karena didorong oleh paksaan regulasi pemerintah yang mewajibkan penggunaan sistem pelaporan digital. Pemberian akses perangkat lunak secara gratis bagi SPPG akan mengeliminasi hambatan anggaran pada pengguna tahap awal. Tantangan adopsi terbesar justru terletak pada sisi pemasok, yakni rendahnya tingkat literasi digital pada kelompok tani dan UMKM pedesaan. Untuk memitigasi hambatan ini, Nutrimize dirancang tanpa mewajibkan petani mengunduh aplikasi baru; seluruh interaksi purchase order dikirimkan secara langsung melalui integrasi WhatsApp Business API. Sementara itu, hambatan birokrasi terkait pengadaan instansi diatasi dengan mendaftarkan lisensi dasbor premium ke dalam Katalog Elektronik Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP).
.


Progress Update & Attachment	
Progress Since the 1st Submission
Apa perkembangan utama sejak submission sebelumnya? Jelaskan dengan mendetail terutama pada aspek kesiapan bisnis dan implementasi.
Sejak pengajuan pertama, Nutrimize mengalami penajaman strategis dari sekadar platform pelaporan menjadi upstream copilot yang berinteroperasi dengan sistem pemerintah seperti Sistem Dialur. Secara skala pasar, kami memutakhirkan target sasaran berdasarkan data riil per Mei 2026 menjadi 29.225 SPPG. Secara regulasi, kami mengoreksi penguncian Harga Pokok Produksi menjadi nilai perolehan at cost sebesar Rp8.000,00 hingga Rp10.000,00 sesuai Petunjuk Teknis Badan Gizi Nasional. Secara komersial, kami merekayasa ulang model bisnis dengan fitur Financial API Partnership sebagai mitigasi krisis modal kerja akibat sistem pencairan reimbursement. Secara teknis, pengembangan telah melampaui fase ideasi; kami merampungkan desain antarmuka high-fidelity mockup interaktif, serta sedang aktif mengembangkan repositori backend untuk mengintegrasikan algoritma optimasi kecerdasan buatan. 

Current Status
Status solusi saat ini (idea / mockup / prototype / pilot) dan bukti pendukungnya.
Status Nutrimize saat ini adalah prototype. Desain antarmuka pengguna telah dirampungkan ke dalam bentuk high-fidelity mockup interaktif. Fokus pengembangan aktif saat ini berada pada pengerjaan repositori kode lapisan belakang untuk melatih algoritma optimasi kecerdasan buatan dan pengujian jalur ekstraksi data harga pangan.

Attachment
Lampiran (opsional) yang dapat berupa: demo / prototype, screenshot, atau link tambahan.
Untuk memvalidasi kesiapan teknis dan landasan operasional, berikut adalah lampiran pendukung implementasi proyek Nutrimize:
Desain Antarmuka (High-Fidelity Mockup): https://bit.ly/mockup-nutrimize
Repositori Kode Sistem (In Progress): https://github.com/Hasbirizqulloh/nutrimize
Diagram Arsitektur dan Data: Arsitektur microservices komputasi awan.
Dokumen Acuan: Petunjuk Teknis Tata Kelola Program Makan Bergizi Gratis Tahun 2026 dan Data Pusat Informasi Harga Pangan Strategis (PIHPS) Nasional.
Analisis Komprehensif Ekosistem Aplikasi Resmi Badan Gizi Nasional dan Satuan Pelayanan Pemenuhan Gizi: Pelaporan, Audit Transparansi, dan Standardisasi Gizi. (2026). Dokumen Riset Pendukung Proposal.
Badan Gizi Nasional Republik Indonesia. (2025a). Petunjuk Teknis Pembuatan Rekening SPPG dan Penggunaan Dana Makan Bergizi Gratis (Juknis 6). Jakarta: Badan Gizi Nasional.
Badan Gizi Nasional Republik Indonesia. (2025b). Petunjuk Teknis Tata Kelola Penyelenggaraan Program Makan Bergizi Gratis. Jakarta: Badan Gizi Nasional.
Bank Indonesia. (n.d.). Pusat Informasi Harga Pangan Strategis (PIHPS) Nasional. Diakses pada 4 Juni 2026, dari Portal Resmi Bank Indonesia.
Indonesia Corruption Watch (ICW). (2026). Laporan Pemantauan Lapangan Makan Bergizi Gratis (MBG) Wilayah Jabodetabek, DIY, Bandung, Bali, Kupang, NTB, Medan. Jakarta: Indonesia Corruption Watch.
Kementerian Pendidikan dan Kebudayaan Republik Indonesia. (2015). Pedoman Umum Ejaan Bahasa Indonesia (Permendikbud No. 50 Tahun 2015). Jakarta: Badan Pengembangan dan Pembinaan Bahasa.
Laporan Kajian Tata Kelola Keuangan dan Operasional Satuan Pelayanan Pemenuhan Gizi: Pembuktian Empiris Praktik Kalkulasi Nutrisi dan Rekapitulasi Faktur Berbasis Spreadsheet Manual. (2026). Dokumen Riset Pendukung Proposal.
Rusnindita, K. (2025). Program Makan Bergizi Gratis di Sekolah: Manfaat, Tantangan, dan Menu Bergizi. Lemon8.
Dokumen Referensi Regulasi Dasar: Buku Petunjuk Teknis Pelaksanaan Program MBG oleh Badan Gizi Nasional Tahun 2026.

Badan Gizi Nasional Republik Indonesia. (2026). Petunjuk Teknis Pelaksanaan Program
Makan Bergizi Gratis (MBG). Jakarta: Badan Gizi Nasional. Diakses dari
https://www.bgn.go.id/
2. Fatimah, S., Rasyid, A., Anirwan, A., Qamal, Q., & Arwakon, H. O. (2024). Kebijakan Makan
Bergizi Gratis di Indonesia Timur: Tantangan, Implementasi, dan Solusi untuk Ketahanan
Pangan. Journal of Governance and Policy Innovation, 4(1), 14-21.
http://journal.intelekmadani.org/index.php/jgpi/article/view/641
3. Hermawati, L., Abdullah, M. N. A., & Rizaldi, M. R. (2025). Dampak Kebijakan Makan Bergizi
Gratis Pada Pedagang Kantin: Sebuah Analisis Teori Konflik. Jurnal Ilmiah Wahana
Pendidikan, 11(10). Diakses dari
https://jurnal.peneliti.net/index.php/JIWP/article/download/11814/9059/
4. Putri, D. A., & Sari, M. (2025). Hubungan Daya Terima Makanan Dengan Sisa Makan Siang
(Food Waste) Pada Anak Sekolah Dasar. Jurnal Teknologi Kesehatan dan Terapan Medis,
2(1). Diakses dari
https://ejurnals.com/ojs/index.php/tktm/article/download/3132/3780/11807
5. Bank Indonesia. (2026). Pusat Informasi Harga Pangan Strategis (PIHPS) Nasional. Diakses
dari https://www.bi.go.id/hargapangan/
6. CNBC Indonesia. (2024). Presiden Tetapkan Anggaran Makan Gratis Jadi Rp 10.000. Diakses
dari https://www.cnbcindonesia.com/
7. Food and Agriculture Organization (FAO). (2024). School Feeding Programs: A Global
Review and Case Studies on Food Waste Mitigation. Rome: FAO. Diakses dari
https://www.fao.org/in-action/program-brazil-fao/news/ver/fr/c/1712636/
8. Google AI for Developers. (2026). Gemini API: Function Calling & Dynamic Substitution
Documentation. Diakses dari https://ai.google.dev/gemini-api/docs/function-calling
9. Google Developers. (2026). Google OR-Tools: Constraint Optimization Documentation.
Diakses dari https://developers.google.com/optimization/
10. Kementerian Kesehatan Republik Indonesia. (2019). Peraturan Menteri Kesehatan No. 28
Tahun 2019 tentang Angka Kecukupan Gizi (AKG) yang Dianjurkan untuk Masyarakat
Indonesia. Jakarta: Kementerian Kesehatan RI. Diakses dari
https://peraturan.bpk.go.id/Home/Details/138621/permenkes-no-28-tahun-2019
Kementerian PPN/Bappenas & LCDI Indonesia. (2021). Laporan Kajian Food Loss and Waste
(FLW) di Indonesia. Jakarta: Bappenas. Diakses dari https://lcdi-indonesia.id/wpcontent/uploads/2021/06/Report-Kajian-FLW-FINAL-4.pdf
12. TVRI Jakarta News. (2025). Evaluasi Operasional 5.103 Satuan Pelayanan Pemenuhan Gizi
(SPPG). Diakses dari https://tvrijakartanews.com/article/News/23096
Referensi / Sumber Data
Badan Gizi Nasional. (2026). Awal 2026, Program MBG Jangkau Hampir 60 Juta Penerima Manfaat. https://www.bgn.go.id/news/siaran-pers/awal-2026-program-mbg-jangkau-hampir-60-juta-penerima-manfaat
Detik Finance. (2026). Program MBG Serap 1,28 Juta Pekerja, Tersebar di 29 Ribu SPPG. https://finance.detik.com/berita-ekonomi-bisnis/d-8501449
CNBC Indonesia. (2026). BGN: Anggaran Bahan Makan MBG Rp8.000–Rp10.000 Bukan Rp15.000. https://www.cnbcindonesia.com/news/20260224115258-4-713364
Kompas. (2026). BGN: Anggaran Bahan Makanan MBG Rp8.000–Rp10.000, Bukan Rp15.000. https://nasional.kompas.com/read/2026/02/24/15480101
Tempo. (2025). Fakta Kisruh Tunggakan Pembayaran Mitra MBG Kalibata. https://www.tempo.co/hukum/fakta-kisruh-tunggakan-pembayaran-mitra-mbg-kalibata-1233690
Global7. (2026). Modal Rp1,7 Miliar Diduga Belum Dibayar, Pemilik Dapur MBG di Blora Laporkan Yayasan. https://global7.id/modal-rp17-miliar-dapur-mbg-blora-laporkan-yayasan/
Media Indonesia. (2026). BGN dan Kemenkeu Hadirkan Sistem Digital Pelaporan Keuangan SPPG. https://mediaindonesia.com/ekonomi/869689
Brangkas. (2025). Sistem Pelaporan Transparan MBG (Dialur, Rapor MBG). https://brangkas.id/sistem-pelaporan-transparan-mbg/
LKPP. (2025). Era Baru Pengadaan Barang/Jasa Pemerintah dengan Katalog Elektronik V6. https://www.lkpp.go.id/read/s/era-baru-pengadaan-barang-jasa-pemerintah-dengan-katalog-elektronik-v6
Bank Indonesia. Pusat Informasi Harga Pangan Strategis (PIHPS) Nasional. https://www.bi.go.id/hargapangan
Rakyat Bekasi. (2026). Dapur MBG di Bekasi Bertambah, 153 SPPG Antre Izin SLHS. https://rakyatbekasi.com/dapur-makan-bergizi-gratis-di-bekasi-bertambah-dua-kali-lipat-153-sppg-masih-proses-sertifikasi/
Kementerian Kesehatan RI. (2019). PMK No. 28/2019 tentang Angka Kecukupan Gizi. https://peraturan.bpk.go.id/Home/Details/138621

