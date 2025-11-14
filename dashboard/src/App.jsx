import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Peserta from './pages/Peserta';
import Tagihan from './pages/Tagihan';
import Riwayat from './pages/Riwayat';
import Faskes from './pages/Faskes';
import Pengaduan from './pages/Pengaduan';
import Antrian from './pages/Antrian';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="logo">
              <div className="logo-icon">🏥</div>
              {sidebarOpen && <span>JKN Dashboard</span>}
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" className="nav-item">
              <span className="nav-icon">📊</span>
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
            <Link to="/peserta" className="nav-item">
              <span className="nav-icon">👥</span>
              {sidebarOpen && <span>Peserta</span>}
            </Link>
            <Link to="/tagihan" className="nav-item">
              <span className="nav-icon">💰</span>
              {sidebarOpen && <span>Tagihan</span>}
            </Link>
            <Link to="/riwayat" className="nav-item">
              <span className="nav-icon">📋</span>
              {sidebarOpen && <span>Riwayat</span>}
            </Link>
            <Link to="/faskes" className="nav-item">
              <span className="nav-icon">🏥</span>
              {sidebarOpen && <span>Faskes</span>}
            </Link>
            <Link to="/pengaduan" className="nav-item">
              <span className="nav-icon">📢</span>
              {sidebarOpen && <span>Pengaduan</span>}
            </Link>
            <Link to="/antrian" className="nav-item">
              <span className="nav-icon">🎫</span>
              {sidebarOpen && <span>Antrian</span>}
            </Link>
          </nav>

          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/peserta" element={<Peserta />} />
            <Route path="/tagihan" element={<Tagihan />} />
            <Route path="/riwayat" element={<Riwayat />} />
            <Route path="/faskes" element={<Faskes />} />
            <Route path="/pengaduan" element={<Pengaduan />} />
            <Route path="/antrian" element={<Antrian />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

