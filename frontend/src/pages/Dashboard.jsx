import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetching all IPOs from your backend
        const data = await api.getIpos();
        setIpos(data || []); // Adjust based on your actual API response structure
      } catch (error) {
        console.error("Failed to fetch IPOs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading AI Insights...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">IPO dashboard</h1>
        <p className="text-gray-500 text-sm">India mainboard & SME IPOs — March 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active IPOs List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-gray-800 mb-4">Active & upcoming IPOs</h2>
          {ipos.map((ipo) => (
            <Link key={ipo.id} to={`/ipo/${ipo.id}`}>
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 font-bold border border-gray-200">
                    {ipo.id ? ipo.id.substring(0, 3).toUpperCase() : 'NA'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                      {ipo.name || 'Company Name'}
                    </h3>
                    <p className="text-xs text-gray-500">{ipo.sector || 'Sector'} • NSE + BSE</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                   <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">Open</span>
                   <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Evaluate</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column: AI Risk Overview */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-6">AI risk overview</h2>
          <div className="space-y-5">
            {ipos.slice(0, 5).map((ipo) => (
              <div key={`risk-${ipo.id}`} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium truncate w-32">{ipo.name}</span>
                <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                   {/* Dummy visualization based on string match for now */}
                   <div className={`h-full rounded-full ${ipo.id === 'steel' ? 'bg-red-500 w-4/5' : 'bg-green-500 w-1/4'}`}></div>
                </div>
                <span className={`text-xs font-bold ${ipo.id === 'steel' ? 'text-red-600' : 'text-green-600'}`}>
                  {ipo.id === 'steel' ? 'High' : 'Low'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}