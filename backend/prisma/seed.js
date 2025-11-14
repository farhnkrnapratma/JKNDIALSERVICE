const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Peserta (using upsert for SQLite compatibility)
  const pesertaData = [
    {
      nik: '3201234567890001',
      nama: 'Budi Santoso',
      status: 'Aktif',
      kelas: 'Kelas III',
      fktp: 'Puskesmas Cibinong',
      noHP: '081234567890',
      email: 'budi@example.com',
      alamat: 'Jl. Merdeka No. 123, Bogor',
      noKK: '3201012345678901'
    },
    {
      nik: '3201234567890002',
      nama: 'Siti Aminah',
      status: 'Aktif',
      kelas: 'Kelas II',
      fktp: 'Puskesmas Ciawi',
      noHP: '081234567891',
      email: 'siti@example.com',
      alamat: 'Jl. Raya Ciawi No. 45, Bogor',
      noKK: '3201012345678902'
    },
    {
      nik: '3201234567890003',
      nama: 'Ahmad Hidayat',
      status: 'NonAktif',
      kelas: 'Kelas III',
      fktp: 'Puskesmas Cibinong',
      noHP: '081234567892',
      alamat: 'Jl. Kenanga No. 78, Bogor',
      noKK: '3201012345678903'
    },
    {
      nik: '1671122812030001',
      nama: 'Zain Ahmad Fahrezi',
      status: 'Aktif',
      kelas: 'Kelas II',
      fktp: 'Klinik Opina',
      noHP: '089604332830',
      email: 'zainahmadfahrezi@gmail.com',
      alamat: 'JL. PSI Kenayan, Lr. Gumarang',
      noKK: '1671121612140002'
    }
  ];

  for (const data of pesertaData) {
    await prisma.peserta.upsert({
      where: { nik: data.nik },
      update: {},
      create: data
    });
  }

  // Seed Tagihan
  const tagihanData = [
    { nik: '3201234567890001', bulan: '2025-01', jumlah: 42000, tunggakan: 0, denda: 0 },
    { nik: '3201234567890001', bulan: '2024-12', jumlah: 42000, tunggakan: 0, denda: 0 },
    { nik: '3201234567890002', bulan: '2025-01', jumlah: 110000, tunggakan: 0, denda: 0 },
    { nik: '3201234567890003', bulan: '2025-01', jumlah: 42000, tunggakan: 126000, denda: 15000 },
    { nik: '3201234567890003', bulan: '2024-12', jumlah: 42000, tunggakan: 84000, denda: 10000 },
    { nik: '1671122812030001', bulan: '2025-01', jumlah: 110000, tunggakan: 0, denda: 0 },
    { nik: '1671122812030001', bulan: '2024-12', jumlah: 110000, tunggakan: 0, denda: 0 }
  ];

  for (const data of tagihanData) {
    await prisma.tagihan.create({ data });
  }

  // Seed Riwayat
  const riwayatData = [
    {
      nik: '3201234567890001',
      tanggal: '2025-01-10',
      jenis: 'FKTP',
      detail: 'Pemeriksaan kesehatan umum',
      faskes: 'Puskesmas Cibinong'
    },
    {
      nik: '3201234567890001',
      tanggal: '2024-12-15',
      jenis: 'Rujukan',
      detail: 'Rujukan ke RS untuk pemeriksaan lanjutan',
      faskes: 'RS PMI Bogor'
    },
    {
      nik: '3201234567890002',
      tanggal: '2025-01-05',
      jenis: 'FKTP',
      detail: 'Kontrol rutin hipertensi',
      faskes: 'Puskesmas Ciawi'
    },
    {
      nik: '1671122812030001',
      tanggal: '2025-01-12',
      jenis: 'FKTP',
      detail: 'Pemeriksaan kesehatan umum',
      faskes: 'Klinik Opina'
    }
  ];

  for (const data of riwayatData) {
    await prisma.riwayat.create({ data });
  }

  // Seed Faskes
  const faskesData = [
    {
      kode: 'PKM-BGR-001',
      nama: 'Puskesmas Cibinong',
      jenis: 'FKTP',
      kabupaten: 'Bogor',
      kecamatan: 'Cibinong',
      alamat: 'Jl. Tegar Beriman No. 1',
      telp: '021-87654321',
      kuotaHari: 50
    },
    {
      kode: 'PKM-BGR-002',
      nama: 'Puskesmas Ciawi',
      jenis: 'FKTP',
      kabupaten: 'Bogor',
      kecamatan: 'Ciawi',
      alamat: 'Jl. Raya Ciawi No. 100',
      telp: '0251-123456',
      kuotaHari: 40
    },
    {
      kode: 'RS-BGR-001',
      nama: 'RS PMI Bogor',
      jenis: 'RS',
      kabupaten: 'Bogor',
      kecamatan: 'Bogor Tengah',
      alamat: 'Jl. Raya Pajajaran No. 80',
      telp: '0251-321321',
      kuotaHari: 200
    },
    {
      kode: 'RS-BGR-002',
      nama: 'RSUD Kota Bogor',
      jenis: 'RS',
      kabupaten: 'Bogor',
      kecamatan: 'Bogor Tengah',
      alamat: 'Jl. Ir. H. Juanda No. 10',
      telp: '0251-654321',
      kuotaHari: 300
    },
    {
      kode: 'KLN-BGR-001',
      nama: 'Klinik Pratama Sehat',
      jenis: 'Klinik',
      kabupaten: 'Bogor',
      kecamatan: 'Cibinong',
      alamat: 'Jl. Mayor Oking No. 20',
      telp: '0251-789789',
      kuotaHari: 30
    },
    {
      kode: 'KLN-OPI-001',
      nama: 'Klinik Opina',
      jenis: 'Klinik',
      kabupaten: 'Palembang',
      kecamatan: 'Ilir Timur II',
      alamat: 'Jl. PSI Kenayan, Lr. Gumarang',
      telp: '0711-555123',
      kuotaHari: 35
    }
  ];

  for (const data of faskesData) {
    await prisma.faskes.upsert({
      where: { kode: data.kode },
      update: {},
      create: data
    });
  }

  // Seed Antrian
  const antrianData = [
    {
      kodeFaskes: 'PKM-BGR-001',
      nik: '3201234567890001',
      nomorAntri: 'A001',
      tanggal: '2025-01-15',
      status: 'Menunggu',
      estimasi: '30 menit'
    },
    {
      kodeFaskes: 'PKM-BGR-002',
      nik: '3201234567890002',
      nomorAntri: 'B005',
      tanggal: '2025-01-15',
      status: 'Dilayani',
      estimasi: '5 menit'
    }
  ];

  for (const data of antrianData) {
    await prisma.antrian.create({ data });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
