import { useState, useEffect } from 'react';
import axios from 'axios';

function Riwayat() {
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
      const response = await axios.get('/api/dashboard/data/riwayat');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat riwayat pelayanan: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.pesertaNik.includes(search) ||
    item.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">⏳ Memuat riwayat pelayanan...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Riwayat Pelayanan</h1>
        <p>Track riwayat pelayanan kesehatan peserta JKN</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>📋 {filteredData.length} Riwayat</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari NIK atau diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada riwayat pelayanan ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>NIK Peserta</th>
                <th>Tanggal</th>
                <th>Faskes</th>
                <th>Diagnosis</th>
                <th>Tindakan</th>
                <th>Dokter</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.pesertaNik}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td>{item.faskes}</td>
                  <td><strong>{item.diagnosis}</strong></td>
                  <td>{item.tindakan}</td>
                  <td>{item.dokter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Riwayat;
