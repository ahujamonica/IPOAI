import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import IpoDetail from './pages/IpoDetail';
import Compare from './pages/Compare';
import Companies from './pages/Companies'; // NEW
import About from './pages/About'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add these pages as you build them out */}
            <Route path="/companies" element={<Companies />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/about" element={<About />} />
            <Route path="/ipo/:id" element={<IpoDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;