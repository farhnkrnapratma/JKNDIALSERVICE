import { useState, useEffect } from 'react';
import axios from 'axios';

function Pengaduan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/data/pengaduan');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data pengaduan: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.pesertaNik.includes(search) ||
    item.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">⏳ Memuat data pengaduan...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Pengaduan Peserta</h1>
        <p>Monitor dan kelola pengaduan dari peserta JKN</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>📢 {filteredData.length} Pengaduan</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari NIK atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada pengaduan ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>NIK</th>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Isi Pengaduan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.pesertaNik}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td><strong>{item.kategori}</strong></td>
                  <td>{item.isi}</td>
                  <td>
                    <span className={`badge ${item.status === 'Selesai' ? 'aktif' : 'belum-lunas'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Pengaduan;
