import { useState, useEffect } from 'react';
import axios from 'axios';

function Tagihan() {
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
      const response = await axios.get('/api/dashboard/data/tagihan');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data tagihan: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.pesertaNik.includes(search)
  );

  if (loading) return <div className="loading">⏳ Memuat data tagihan...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Data Tagihan & Iuran</h1>
        <p>Monitoring tagihan dan tunggakan iuran peserta JKN</p>
      </div>

      <div className="data-table">
        <div className="table-header">
          <h2>💰 {filteredData.length} Tagihan</h2>
          <input
            type="text"
            className="search-box"
            placeholder="🔍 Cari NIK peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredData.length === 0 ? (
          <div className="empty">Tidak ada data tagihan ditemukan</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>NIK Peserta</th>
                <th>Bulan Terakhir Bayar</th>
                <th>Tunggakan</th>
                <th>Status</th>
                <th>Total Tunggakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.pesertaNik}</td>
                  <td>{item.bulanTerakhirBayar}</td>
                  <td>{item.tunggakan} bulan</td>
                  <td>
                    <span className={`badge ${item.status === 'Lunas' ? 'lunas' : 'belum-lunas'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <strong>Rp {item.totalTunggakan.toLocaleString('id-ID')}</strong>
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

export default Tagihan;
