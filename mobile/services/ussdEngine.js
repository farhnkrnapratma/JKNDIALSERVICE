import pesertaData from '../data/peserta.json';
import tagihanData from '../data/tagihan.json';
import riwayatData from '../data/riwayat.json';
import faskesData from '../data/faskes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

class UssdEngine {
  constructor() {
    this.peserta = pesertaData;
    this.tagihan = tagihanData;
    this.riwayat = riwayatData;
    this.faskes = faskesData;
    this.antrian = [];
    this.pendaftaranbaru = [];
    this.pengaduan = [];
    this.konsultasi = [];
    this.initializeData();
  }

  async initializeData() {
    try {
      const savedPeserta = await AsyncStorage.getItem('peserta_data');
      if (savedPeserta) {
        this.peserta = JSON.parse(savedPeserta);
      }
    } catch (error) {
      console.error('Error loading peserta data:', error);
    }
  }

  validateNIK(nik) {
    if (!nik || typeof nik !== 'string') return false;
    return /^\d{16}$/.test(nik.trim());
  }

  validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    return /^(08|628)\d{8,11}$/.test(phone.trim());
  }

  processRequest(text, phoneNumber) {
    try {
      const inputs = text ? text.split('*') : [];

      if (inputs.length === 0 || text === '') {
        return this.mainMenu();
      }

      const mainChoice = inputs[0];

      switch (mainChoice) {
        case '1':
          return this.infoKepesertaan(inputs, phoneNumber);
        case '2':
          return this.tagihanIuran(inputs, phoneNumber);
        case '3':
          return this.riwayatPelayanan(inputs, phoneNumber);
        case '4':
          return this.infoFaskes(inputs);
        case '5':
          return this.perubahanData(inputs, phoneNumber);
        case '6':
          return this.pengaduan(inputs, phoneNumber);
        case '7':
          return this.sos(inputs);
        case '8':
          return this.daftarPesertaBaru(inputs, phoneNumber);
        case '9':
          return this.antrianFaskes(inputs, phoneNumber);
        case '10':
          return this.konsultasi(inputs, phoneNumber);
        case '0':
          return 'END Terima kasih telah menggunakan layanan JKN Mobile. Tetap sehat!';
        default:
          return 'END Pilihan tidak valid. Silakan coba lagi dengan dial *354#';
      }
    } catch (error) {
      console.error('USSD Engine Error:', error);
      return 'END Terjadi kesalahan sistem. Silakan coba lagi.';
    }
  }

  mainMenu() {
    return `CON Selamat datang di JKN Mobile
1. Info Kepesertaan
2. Tagihan & Iuran
3. Riwayat Pelayanan
4. Info Faskes
5. Perubahan Data
6. Pengaduan
7. Layanan Darurat
8. Daftar Peserta Baru
9. Antrian Faskes
10. Konsultasi
0. Keluar`;
  }

  infoKepesertaan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Info Kepesertaan
Masukkan NIK Anda (16 digit):`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];

      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const peserta = this.peserta.find((p) => p.nik === nik);

      if (!peserta) {
        return 'END NIK tidak ditemukan dalam data JKN.';
      }

      return `END Info Kepesertaan
Nama: ${peserta.nama}
NIK: ${peserta.nik}
Status: ${peserta.status}
Kelas: ${peserta.kelas}
FKTP: ${peserta.fktp}
Alamat: ${peserta.alamat || '-'}
No. HP: ${peserta.noHP || '-'}`;
    }

    return 'END Input tidak valid.';
  }

  tagihanIuran(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Tagihan & Iuran
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];

      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const peserta = this.peserta.find((p) => p.nik === nik);

      if (!peserta) {
        return 'END NIK tidak ditemukan.';
      }

      const tagihanList = this.tagihan
        .filter((t) => t.nik === nik)
        .sort((a, b) => b.bulan.localeCompare(a.bulan));

      if (tagihanList.length === 0) {
        return `END Tagihan ${peserta.nama}
Tidak ada data tagihan.`;
      }

      const tagihan = tagihanList[0];
      const totalTagihan = tagihan.jumlah + tagihan.tunggakan + tagihan.denda;

      return `END Tagihan ${peserta.nama}
Bulan: ${tagihan.bulan}
Iuran: Rp ${tagihan.jumlah.toLocaleString('id-ID')}
Tunggakan: Rp ${tagihan.tunggakan.toLocaleString('id-ID')}
Denda: Rp ${tagihan.denda.toLocaleString('id-ID')}
Total: Rp ${totalTagihan.toLocaleString('id-ID')}`;
    }

    return 'END Input tidak valid.';
  }

  riwayatPelayanan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Riwayat Pelayanan
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];

      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const riwayatList = this.riwayat
        .filter((r) => r.nik === nik)
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        .slice(0, 5);

      if (riwayatList.length === 0) {
        return 'END Tidak ada riwayat pelayanan.';
      }

      let response = 'END Riwayat Pelayanan:\n\n';
      riwayatList.forEach((r, index) => {
        response += `${index + 1}. ${r.tanggal}\n${r.jenis} - ${r.faskes}\n${r.detail}\n\n`;
      });

      return response;
    }

    return 'END Input tidak valid.';
  }

  infoFaskes(inputs) {
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

      const faskesList = this.faskes.filter((f) => f.jenis === jenis).slice(0, 10);

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

  perubahanData(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Perubahan Data
Masukkan NIK Anda:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];

      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }

      const peserta = this.peserta.find((p) => p.nik === nik);

      if (!peserta) {
        return 'END NIK tidak ditemukan.';
      }

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
      const fieldType = inputs[2];
      const newValue = inputs[3];
      const jenisMap = {
        '1': 'noHP',
        '2': 'email',
        '3': 'alamat',
        '4': 'fktp'
      };

      const pesertaIndex = this.peserta.findIndex((p) => p.nik === nik);
      if (pesertaIndex !== -1) {
        const fieldName = jenisMap[fieldType];
        if (fieldName) {
          this.peserta[pesertaIndex][fieldName] = newValue;
          this.savePesertaData();
        }
      }

      return `END Perubahan data berhasil!
Data Anda telah diperbarui.`;
    }

    return 'END Input tidak valid.';
  }

  pengaduan(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Pengaduan
Ketik pesan pengaduan Anda (max 160 karakter):`;
    }

    if (inputs.length === 2) {
      const pesan = inputs[1];

      this.pengaduan.push({
        nomor: phoneNumber || 'Anonymous',
        pesan: pesan.substring(0, 160),
        tanggal: new Date().toISOString()
      });

      return `END Pengaduan Anda telah diterima.
Nomor tiket akan dikirim via SMS.
Terima kasih.`;
    }

    return 'END Input tidak valid.';
  }

  sos(inputs) {
    if (inputs.length === 1) {
      return `CON Layanan Darurat
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

  daftarPesertaBaru(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Pendaftaran Peserta Baru
Masukkan NIK:`;
    }

    if (inputs.length === 2) {
      const nik = inputs[1];
      if (!this.validateNIK(nik)) {
        return 'END Format NIK tidak valid.\nNIK harus 16 digit angka.';
      }
      const existingPeserta = this.peserta.find((p) => p.nik === nik);
      if (existingPeserta) {
        return 'END NIK sudah terdaftar dalam sistem JKN.';
      }
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

      const newPeserta = {
        nik,
        noKK,
        nama,
        status: 'Aktif',
        kelas: 'Kelas III',
        fktp: fktp,
        noHP: phoneNumber || '',
        email: '',
        alamat: domisili
      };

      this.peserta.push(newPeserta);
      this.savePesertaData();

      this.pendaftaranbaru.push({
        nik,
        noKK,
        nama,
        domisili,
        fktpPilihan: fktp,
        tanggal: new Date().toISOString()
      });

      return `END Prapendaftaran berhasil!
NIK: ${nik}
Nama: ${nama}

Lengkapi dokumen di kantor BPJS terdekat dalam 14 hari.`;
    }

    return 'END Input tidak valid.';
  }

  antrianFaskes(inputs, phoneNumber) {
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
        const faskesChoice = inputs[2];
        return `CON Masukkan NIK Anda:`;
      }

      if (action === '2') {
        const nik = inputs[2];
        const antrianList = this.antrian.filter((a) => a.nik === nik).sort((a, b) => b.createdAt - a.createdAt);

        if (antrianList.length === 0) {
          return 'END Anda belum memiliki antrian hari ini.';
        }

        const antrian = antrianList[0];
        const faskes = this.faskes.find((f) => f.kode === antrian.kodeFaskes);

        return `END Antrian Anda:
${faskes?.nama || 'Faskes'}
No. Antrian: ${antrian.nomorAntri}
Status: ${antrian.status}
Estimasi: ${antrian.estimasi || '-'}`;
      }

      if (action === '3') {
        const kodeFaskes = inputs[2];
        const today = new Date().toISOString().split('T')[0];
        const jumlahAntrian = this.antrian.filter((a) => a.kodeFaskes === kodeFaskes && a.tanggal === today && a.status === 'Menunggu').length;
        const estimasi = jumlahAntrian * 15;

        return `END Estimasi Waktu Tunggu:
Antrian menunggu: ${jumlahAntrian}
Estimasi: ${estimasi} menit

Silakan datang tepat waktu.`;
      }
    }

    if (inputs.length === 4 && inputs[1] === '1') {
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

      this.antrian.push({
        kodeFaskes,
        nik,
        nomorAntri,
        tanggal,
        status: 'Menunggu',
        estimasi: '30 menit',
        createdAt: Date.now()
      });

      const faskes = this.faskes.find((f) => f.kode === kodeFaskes);

      return `END Nomor antrian berhasil diambil!
${faskes?.nama || 'Faskes'}
No. Antrian: ${nomorAntri}
Tanggal: ${tanggal}
Estimasi: 30 menit

Harap datang tepat waktu.`;
    }

    return 'END Input tidak valid.';
  }

  konsultasi(inputs, phoneNumber) {
    if (inputs.length === 1) {
      return `CON Konsultasi JKN
Ketik pertanyaan Anda (max 160 karakter):`;
    }

    if (inputs.length === 2) {
      const pertanyaan = inputs[1];

      this.konsultasi.push({
        nomor: phoneNumber || 'Anonymous',
        pertanyaan: pertanyaan.substring(0, 160),
        tanggal: new Date().toISOString()
      });

      return `END Pertanyaan Anda telah diterima.
Tim JKN akan menjawab melalui SMS dalam 1x24 jam.
Terima kasih.`;
    }

    return 'END Input tidak valid.';
  }

  savePesertaData() {
    try {
      AsyncStorage.setItem('peserta_data', JSON.stringify(this.peserta))
        .catch(error => console.error('Error saving peserta data:', error));
    } catch (error) {
      console.error('Error in savePesertaData:', error);
    }
  }
}

export default new UssdEngine();
