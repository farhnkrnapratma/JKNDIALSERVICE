import { useState, useEffect } from 'react';
import axios from 'axios';

function Faskes() {
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
      const response = await axios.get('/api/dashboard/data/faskes');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data faskes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.kode.includes(search)
  );

  if (loading) return <div className="loading">⏳ Memuat data faskes...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Fasilitas Kesehatan</h1>
        <p>Daftar fasilitas kesehatan yang bekerja sama dengan JKN</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>🏥 {filteredData.length} Faskes</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari nama atau kode faskes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada data faskes ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Faskes</th>
                <th>Tipe</th>
                <th>Alamat</th>
                <th>Telepon</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.kode}</strong></td>
                  <td>{item.nama}</td>
                  <td>{item.tipe}</td>
                  <td>{item.alamat}</td>
                  <td>{item.telepon}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Faskes;
