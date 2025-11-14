-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phoneNumber" TEXT,
    "text" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UssdMenuLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Peserta" (
    "nik" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "fktp" TEXT NOT NULL,
    "noHP" TEXT,
    "email" TEXT,
    "alamat" TEXT,
    "noKK" TEXT
);

-- CreateTable
CREATE TABLE "Tagihan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nik" TEXT NOT NULL,
    "bulan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tunggakan" INTEGER NOT NULL,
    "denda" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Riwayat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nik" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "faskes" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomor" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Faskes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "kabupaten" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "telp" TEXT,
    "kuotaHari" INTEGER NOT NULL DEFAULT 50
);

-- CreateTable
CREATE TABLE "Antrian" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kodeFaskes" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "nomorAntri" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "estimasi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Konsultasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomor" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "jawaban" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PendaftaranBaru" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nik" TEXT NOT NULL,
    "noKK" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "domisili" TEXT NOT NULL,
    "fktpPilihan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Prapendaftaran',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Faskes_kode_key" ON "Faskes"("kode");
