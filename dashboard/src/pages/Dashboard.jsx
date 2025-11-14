import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/data/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data statistik: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Memuat data...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard JKN</h1>
        <p>Selamat datang di Dashboard Administrasi JKN USSD Simulator</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Peserta</div>
          <div className="stat-value">{stats?.totalPeserta || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Peserta Aktif</div>
          <div className="stat-value">{stats?.pesertaAktif || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Tunggakan</div>
          <div className="stat-value">
            Rp {(stats?.totalTunggakan || 0).toLocaleString('id-ID')}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-label">Total Faskes</div>
          <div className="stat-value">{stats?.totalFaskes || 0}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-label">Total Pengaduan</div>
          <div className="stat-value">{stats?.totalPengaduan || 0}</div>
        </div>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>🎯 Fitur Dashboard</h2>
        </div>
        <div style={{padding: '24px'}}>
          <ul style={{listStyle: 'none', lineHeight: '2'}}>
            <li>✅ Data Peserta - Lihat semua peserta JKN terdaftar</li>
            <li>✅ Data Tagihan - Monitor tagihan dan tunggakan iuran</li>
            <li>✅ Riwayat Pelayanan - Track pelayanan kesehatan peserta</li>
            <li>✅ Data Faskes - Daftar fasilitas kesehatan</li>
            <li>✅ Pengaduan - Monitor keluhan peserta</li>
            <li>✅ Antrian - Kelola antrian online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
