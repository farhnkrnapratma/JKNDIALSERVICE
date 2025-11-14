import { useState, useEffect } from 'react';
import axios from 'axios';

function Antrian() {
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
      const response = await axios.get('/api/dashboard/data/antrian');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data antrian: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.pesertaNik.includes(search) ||
    item.faskes.toLowerCase().includes(search.toLowerCase())
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

  if (loading) return <div className="loading">⏳ Memuat data antrian...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Antrian Online</h1>
        <p>Kelola antrian online peserta di fasilitas kesehatan</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>🎫 {filteredData.length} Antrian</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari NIK atau faskes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada data antrian ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>NIK</th>
                <th>Faskes</th>
                <th>Poli</th>
                <th>Tanggal</th>
                <th>No. Antrian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.kodeBooking}</strong></td>
                  <td>{item.pesertaNik}</td>
                  <td>{item.faskes}</td>
                  <td>{item.poli}</td>
                  <td>{formatDate(item.tanggal)}</td>
                  <td><strong>#{item.nomorAntrian}</strong></td>
                  <td>
                    <span className={`badge ${item.status === 'Aktif' ? 'aktif' : 'nonaktif'}`}>
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

export default Antrian;
