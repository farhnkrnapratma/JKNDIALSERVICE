import { useState, useEffect } from 'react';
import axios from 'axios';

function Peserta() {
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
      const response = await axios.get('/api/dashboard/data/peserta');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data peserta: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.nik.includes(search)
  );

  if (loading) return <div className="loading">⏳ Memuat data peserta...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Data Peserta JKN</h1>
        <p>Daftar semua peserta terdaftar dalam sistem JKN</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>👥 {filteredData.length} Peserta</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari nama atau NIK..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada data peserta ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>NIK</th>
                <th>Nama</th>
                <th>No Kartu</th>
                <th>Kelas</th>
                <th>Status</th>
                <th>Faskes</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.nik}>
                  <td>{item.nik}</td>
                  <td><strong>{item.nama}</strong></td>
                  <td>{item.noKartu}</td>
                  <td>Kelas {item.kelas}</td>
                  <td>
                    <span className={`badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.faskes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Peserta;
