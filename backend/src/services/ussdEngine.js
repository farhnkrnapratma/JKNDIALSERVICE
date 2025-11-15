const prisma = require('../config/db');

/**
 * USSD Engine - Core Logic untuk Menu JKN
 * 
 * CATATAN PENTING:
 * Ini adalah prototipe simulasi USSD yang berjalan melalui WiFi/HTTP.
 * Dial *354# hanya memicu request ke server backend internal.
 * Untuk implementasi USSD resmi, kode harus didaftarkan ke operator seluler melalui USSD Gateway.
 */

class UssdEngine {
  
  /**
   * Validate NIK format (16 digits)
   */
  validateNIK(nik) {
    if (!nik || typeof nik !== 'string') return false;
    return /^\d{16}$/.test(nik.trim());
  }

  /**
   * Validate phone number format (08xxx or 628xxx)
   */
  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    return /^(08|628)\d{8,11}$/.test(phone.trim());
  }

  /**
   * Process USSD request berdasarkan input user
   */
  async processRequest(sessionId, text, phoneNumber, serviceCode) {
    try {
      // Log request
      await this.logRequest(sessionId, text || '', '');

      // Parse text input
      const inputs = text ? text.split('*') : [];
      
      // Main menu
      if (inputs.length === 0 || text === '') {
        return this.mainMenu();
      }

      const mainChoice = inputs[0];

      switch (mainChoice) {
        case '1': // Info Kepesertaan
          return await this.infoKepesertaan(inputs, phoneNumber);
        
        case '2': // Tagihan & Iuran
          return await this.tagihanIuran(inputs, phoneNumber);
        
        case '3': // Riwayat Pelayanan
          return await this.riwayatPelayanan(inputs, phoneNumber);
        
        case '4': // Info Faskes
          return await this.infoFaskes(inputs);
        
        case '5': // Perubahan Data
          return await this.perubahanData(inputs, phoneNumber);
        
        case '6': // Pengaduan
          return await this.pengaduan(inputs, phoneNumber);
        
        case '7': // SOS
          return await this.sos(inputs);
        
        case '8': // Daftar Peserta Baru
          return await this.daftarPesertaBaru(inputs, phoneNumber);
        
        case '9': // Antrian Faskes
          return await this.antrianFaskes(inputs, phoneNumber);
        
        case '10': // Konsultasi
          return await this.konsultasi(inputs, phoneNumber);
        
        case '0': // Keluar
          return 'END Terima kasih telah menggunakan layanan JKN Mobile. Tetap sehat!';
        
        default:
          return 'END Pilihan tidak valid. Silakan coba lagi dengan dial *354#';
      }

    } catch (error) {
      console.error('USSD Engine Error:', error);
      return 'END Terjadi kesalahan sistem. Silakan coba lagi.';
    }
  }

  /**
   * Main Menu
   */
  mainMenu() {
    return `CON Selamat datang di JKN Mobile
1. Info Kepesertaan
2. Tagihan & Iuran
3. Riwayat Pelayanan
4. Info Faskes
5. Perubahan Data
6. Pengaduan
7. SOS
8. Daftar Peserta Baru
9. Antrian Faskes
10. Konsultasi
0. Keluar`;
  }

  /**
   * 1. Info Kepesertaan
   */
  async infoKepesertaan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Info Kepesertaan
Masukkan NIK Anda (16 digit):`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];
      
      // Validate NIK format
      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const peserta = await prisma.peserta.findUnique({ where: { nik } });

      if (!peserta) {
        return 'END NIK tidak ditemukan dalam database JKN.';
      }

      return `END Info Kepesertaan
Nama: ${peserta.nama}
NIK: ${peserta.nik}
Status: ${peserta.status}
Kelas: ${peserta.kelas}
FKTP: ${peserta.fktp}
No. HP: ${peserta.noHP || '-'}`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 2. Tagihan & Iuran
   */
  async tagihanIuran(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Tagihan & Iuran
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];
      
      // Validate NIK format
      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const peserta = await prisma.peserta.findUnique({ where: { nik } });

      if (!peserta) {
        return 'END NIK tidak ditemukan.';
      }

      const tagihan = await prisma.tagihan.findFirst({
        where: { nik },
        orderBy: { bulan: 'desc' }
      });

      if (!tagihan) {
        return `END Tagihan ${peserta.nama}
Tidak ada data tagihan.`;
      }

      const totalTagihan = tagihan.jumlah + tagihan.tunggakan + tagihan.denda;

      return `END Tagihan ${peserta.nama}
Bulan: ${tagihan.bulan}
Iuran: Rp ${tagihan.jumlah.toLocaleString()}
Tunggakan: Rp ${tagihan.tunggakan.toLocaleString()}
Denda: Rp ${tagihan.denda.toLocaleString()}
Total: Rp ${totalTagihan.toLocaleString()}`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 3. Riwayat Pelayanan
   */
  async riwayatPelayanan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Riwayat Pelayanan
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];
      
      // Validate NIK format
      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const riwayat = await prisma.riwayat.findMany({
        where: { nik },
        orderBy: { tanggal: 'desc' },
        take: 5
      });

      if (riwayat.length === 0) {
        return 'END Tidak ada riwayat pelayanan.';
      }

      let response = 'END Riwayat Pelayanan:\n\n';
      riwayat.forEach((r, index) => {
        response += `${index + 1}. ${r.tanggal}\n${r.jenis} - ${r.faskes}\n${r.detail}\n\n`;
      });

      return response;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 4. Info Faskes
   */
  async infoFaskes(inputs) {
    if (inputs.length === 1) {
      return `CON Info Faskes
1. Daftar FKTP
2. Daftar Rumah Sakit
3. Klinik Pratama
0. Kembali`;
    }

    if (inputs.length === 2) {
      const choice = inputs[1];
      let jenis = '';

      switch (choice) {
        case '1':
          jenis = 'FKTP';
          break;
        case '2':
          jenis = 'RS';
          break;
        case '3':
          jenis = 'Klinik';
          break;
        case '0':
          return this.mainMenu();
        default:
          return 'END Pilihan tidak valid.';
      }

      const faskesList = await prisma.faskes.findMany({
        where: { jenis },
        take: 10
      });

      if (faskesList.length === 0) {
        return 'END Tidak ada data faskes.';
      }

      let response = `END Daftar ${jenis}:\n\n`;
      faskesList.forEach((f, index) => {
        response += `${index + 1}. ${f.nama}\n${f.alamat}\nTelp: ${f.telp}\n\n`;
      });

      return response;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 5. Perubahan Data
   */
  async perubahanData(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Perubahan Data
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      return `CON Pilih data yang ingin diubah:
1. No HP
2. Email
3. Alamat
4. FKTP
0. Kembali`;
    }

    if (inputs.length === 3) {
      const jenis = inputs[2];
      const jenisData = ['', 'No HP', 'Email', 'Alamat', 'FKTP'];
      
      if (jenis === '0') {
        return this.mainMenu();
      }

      if (jenis >= '1' && jenis <= '4') {
        return `CON Masukkan ${jenisData[jenis]} baru:`;
      }

      return 'END Pilihan tidak valid.';
    }

    if (inputs.length === 4) {
      const nik = inputs[1];
      const jenis = inputs[2];
      const nilaiBaru = inputs[3];

      const fieldMap = {
        '1': 'noHP',
        '2': 'email',
        '3': 'alamat',
        '4': 'fktp'
      };

      const field = fieldMap[jenis];

      if (field) {
        await prisma.peserta.update({
          where: { nik },
          data: { [field]: nilaiBaru }
        });

        return `END Perubahan data berhasil!
${field}: ${nilaiBaru}

Perubahan akan diproses dalam 1x24 jam.`;
      }
    }

    return 'END Input tidak valid.';
  }

  /**
   * 6. Pengaduan
   */
  async pengaduan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Pengaduan
Ketik pesan pengaduan Anda (max 160 karakter):`;
    }

    if (inputs.length === 2) {
      const pesan = inputs[1];

      await prisma.pengaduan.create({
        data: {
          nomor: phoneNumber || 'Anonymous',
          pesan: pesan.substring(0, 160)
        }
      });

      return `END Pengaduan Anda telah diterima.
Nomor tiket akan dikirim via SMS.
Terima kasih.`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 7. SOS
   */
  async sos(inputs) {
    if (inputs.length === 1) {
      return `CON SOS - Layanan Darurat
1. Nomor Darurat JKN
2. Request Callback
3. Panduan Pertolongan Pertama
0. Kembali`;
    }

    if (inputs.length === 2) {
      const choice = inputs[1];

      switch (choice) {
        case '1':
          return `END Nomor Darurat JKN:
Call Center: 1500-400
Ambulans: 119
IGD Terdekat: 118

Tetap tenang dan ikuti instruksi petugas.`;
        
        case '2':
          return `END Request callback telah dikirim.
Tim JKN akan menghubungi Anda dalam 5-10 menit.`;
        
        case '3':
          return `END Panduan Pertolongan Pertama:
1. Tetap tenang
2. Hubungi 119 untuk ambulans
3. Jangan pindahkan korban jika ada patah tulang
4. Beri napas buatan jika perlu

Untuk panduan lengkap, buka aplikasi Mobile JKN.`;
        
        case '0':
          return this.mainMenu();
        
        default:
          return 'END Pilihan tidak valid.';
      }
    }

    return 'END Input tidak valid.';
  }

  /**
   * 8. Daftar Peserta Baru
   */
  async daftarPesertaBaru(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Pendaftaran Peserta Baru
Masukkan NIK:`;
    }

    if (inputs.length === 2) {
      return `CON Masukkan No. Kartu Keluarga (KK):`;
    }

    if (inputs.length === 3) {
      return `CON Masukkan Nama Lengkap:`;
    }

    if (inputs.length === 4) {
      return `CON Masukkan Domisili (Kab/Kota):`;
    }

    if (inputs.length === 5) {
      return `CON Pilih FKTP:
1. Puskesmas Cibinong
2. Puskesmas Ciawi
3. Klinik Pratama Sehat`;
    }

    if (inputs.length === 6) {
      const nik = inputs[1];
      const noKK = inputs[2];
      const nama = inputs[3];
      const domisili = inputs[4];
      const fktpChoice = inputs[5];

      const fktpMap = {
        '1': 'Puskesmas Cibinong',
        '2': 'Puskesmas Ciawi',
        '3': 'Klinik Pratama Sehat'
      };

      const fktp = fktpMap[fktpChoice] || 'Belum dipilih';

      await prisma.pendaftaranBaru.create({
        data: {
          nik,
          noKK,
          nama,
          domisili,
          fktpPilihan: fktp
        }
      });

      return `END Prapendaftaran berhasil!
NIK: ${nik}
Nama: ${nama}

Lengkapi dokumen di kantor BPJS terdekat dalam 14 hari.`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 9. Antrian Faskes
   */
  async antrianFaskes(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Antrian Faskes
1. Ambil Nomor Antrian
2. Cek Antrian Saya
3. Estimasi Waktu Tunggu
0. Kembali`;
    }

    if (inputs.length === 2) {
      const choice = inputs[1];

      if (choice === '0') {
        return this.mainMenu();
      }

      if (choice === '1') {
        return `CON Pilih Faskes:
1. Puskesmas Cibinong
2. Puskesmas Ciawi
3. RS PMI Bogor`;
      }

      if (choice === '2') {
        return `CON Masukkan NIK Anda:`;
      }

      if (choice === '3') {
        return `CON Masukkan kode faskes:
(Contoh: PKM-BGR-001)`;
      }
    }

    if (inputs.length === 3) {
      const action = inputs[1];

      if (action === '1') {
        // Ambil nomor antrian
        const faskesChoice = inputs[2];
        const faskesMap = {
          '1': 'PKM-BGR-001',
          '2': 'PKM-BGR-002',
          '3': 'RS-BGR-001'
        };

        return `CON Masukkan NIK Anda:`;
      }

      if (action === '2') {
        // Cek antrian
        const nik = inputs[2];
        const antrian = await prisma.antrian.findFirst({
          where: { nik, tanggal: new Date().toISOString().split('T')[0] },
          orderBy: { createdAt: 'desc' }
        });

        if (!antrian) {
          return 'END Anda belum memiliki antrian hari ini.';
        }

        const faskes = await prisma.faskes.findUnique({
          where: { kode: antrian.kodeFaskes }
        });

        return `END Antrian Anda:
${faskes?.nama || 'Faskes'}
No. Antrian: ${antrian.nomorAntri}
Status: ${antrian.status}
Estimasi: ${antrian.estimasi || '-'}`;
      }

      if (action === '3') {
        // Estimasi waktu
        const kodeFaskes = inputs[2];
        const jumlahAntrian = await prisma.antrian.count({
          where: {
            kodeFaskes,
            tanggal: new Date().toISOString().split('T')[0],
            status: 'Menunggu'
          }
        });

        const estimasi = jumlahAntrian * 15;

        return `END Estimasi Waktu Tunggu:
Antrian menunggu: ${jumlahAntrian}
Estimasi: ${estimasi} menit

Silakan datang tepat waktu.`;
      }
    }

    if (inputs.length === 4 && inputs[1] === '1') {
      // Proses ambil antrian
      const faskesChoice = inputs[2];
      const nik = inputs[3];

      const faskesMap = {
        '1': 'PKM-BGR-001',
        '2': 'PKM-BGR-002',
        '3': 'RS-BGR-001'
      };

      const kodeFaskes = faskesMap[faskesChoice];
      const nomorAntri = `A${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`;
      const tanggal = new Date().toISOString().split('T')[0];

      await prisma.antrian.create({
        data: {
          kodeFaskes,
          nik,
          nomorAntri,
          tanggal,
          estimasi: '30 menit'
        }
      });

      const faskes = await prisma.faskes.findUnique({ where: { kode: kodeFaskes } });

      return `END Nomor antrian berhasil diambil!
${faskes?.nama || 'Faskes'}
No. Antrian: ${nomorAntri}
Tanggal: ${tanggal}
Estimasi: 30 menit

Harap datang tepat waktu.`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * 10. Konsultasi
   */
  async konsultasi(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Konsultasi JKN
Ketik pertanyaan Anda (max 160 karakter):`;
    }

    if (inputs.length === 2) {
      const pertanyaan = inputs[1];

      await prisma.konsultasi.create({
        data: {
          nomor: phoneNumber || 'Anonymous',
          pertanyaan: pertanyaan.substring(0, 160)
        }
      });

      return `END Pertanyaan Anda telah diterima.
Tim JKN akan menjawab melalui SMS dalam 1x24 jam.
Terima kasih.`;
    }

    return 'END Input tidak valid.';
  }

  /**
   * Log request untuk tracking
   */
  async logRequest(sessionId, input, response) {
    try {
      await prisma.ussdMenuLog.create({
        data: {
          sessionId,
          input,
          response
        }
      });
    } catch (error) {
      console.error('Log error:', error);
    }
  }
}

module.exports = new UssdEngine();
