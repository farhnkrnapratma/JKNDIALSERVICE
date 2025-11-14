const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

/**
 * Data API Routes untuk Dashboard
 */

// Get all Peserta
router.get('/data/peserta', async (req, res) => {
  try {
    const peserta = await prisma.peserta.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(peserta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Tagihan
router.get('/data/tagihan', async (req, res) => {
  try {
    const tagihan = await prisma.tagihan.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tagihan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Riwayat
router.get('/data/riwayat', async (req, res) => {
  try {
    const riwayat = await prisma.riwayat.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(riwayat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Faskes
router.get('/data/faskes', async (req, res) => {
  try {
    const faskes = await prisma.faskes.findMany({
      orderBy: { nama: 'asc' }
    });
    res.json(faskes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Pengaduan
router.get('/data/pengaduan', async (req, res) => {
  try {
    const pengaduan = await prisma.pengaduan.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(pengaduan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Antrian
router.get('/data/antrian', async (req, res) => {
  try {
    const antrian = await prisma.antrian.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(antrian);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Dashboard Stats
router.get('/data/stats', async (req, res) => {
  try {
    const [
      totalPeserta,
      pesertaAktif,
      totalTagihan,
      totalFaskes,
      totalPengaduan
    ] = await Promise.all([
      prisma.peserta.count(),
      prisma.peserta.count({ where: { status: 'Aktif' } }),
      prisma.tagihan.aggregate({ _sum: { tunggakan: true } }),
      prisma.faskes.count(),
      prisma.pengaduan.count()
    ]);

    res.json({
      totalPeserta,
      pesertaAktif,
      totalTunggakan: totalTagihan._sum.tunggakan || 0,
      totalFaskes,
      totalPengaduan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
