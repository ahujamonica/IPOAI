import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function Companies() {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        const data = await api.getIpos();
        setIpos(data || []);
      } catch (error) {
        console.error("Failed to fetch IPOs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIpos();
  }, []);

  // Filter logic
  const filteredIpos = ipos.filter(ipo => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Open') return ipo.status?.toLowerCase() === 'open';
    if (activeFilter === 'Low risk') return ipo.risk?.toLowerCase() === 'low';
    if (activeFilter === 'Medium risk') return ipo.risk?.toLowerCase() === 'medium';
    if (activeFilter === 'High risk') return ipo.risk?.toLowerCase() === 'high';
    return true;
  });

  const filters = ['All', 'Open', 'Low risk', 'Medium risk', 'High risk'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All IPOs</h1>
        <p className="text-gray-500 text-sm">Browse, filter, and analyse every IPO on the platform</p>
      </div>

      {/* Filter Row */}
      <div className="flex items-center space-x-3 mb-8 overflow-x-auto pb-2">
        <span className="text-sm font-medium text-gray-500 mr-2">Filter:</span>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      )}

      {/* IPO Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIpos.map(ipo => (
            <Link key={ipo.id} to={`/ipo/${ipo.id}`}>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 font-bold border border-gray-200 group-hover:border-green-200 group-hover:bg-green-50 transition-colors">
                      {ipo.id ? ipo.id.substring(0, 3).toUpperCase() : 'NA'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
                        {ipo.name}
                      </h3>
                      <p className="text-sm text-gray-500">{ipo.sector} • NSE + BSE</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    ipo.status?.toLowerCase() === 'open' ? 'bg-green-50 text-green-700' :
                    ipo.status?.toLowerCase() === 'upcoming' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {ipo.status || 'TBA'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center divide-x divide-gray-100">
                  <div>
                    <div className="font-bold text-gray-900">{ipo.price_band || ipo.issuePrice || '-'}</div>
                    <div className="text-xs text-gray-400">Price</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{ipo.pe || '-'}</div>
                    <div className="text-xs text-gray-400">P/E</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{ipo.net_margin || ipo.margin || '-'}</div>
                    <div className="text-xs text-gray-400">Margin</div>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm font-bold ${
                    ipo.risk?.toLowerCase() === 'low' ? 'text-green-600' :
                    ipo.risk?.toLowerCase() === 'high' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {ipo.risk} risk
                  </span>
                  
                  <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        ipo.risk?.toLowerCase() === 'low' ? 'bg-green-500' :
                        ipo.risk?.toLowerCase() === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${ipo.score || 50}%` }}
                    ></div>
                  </div>
                  
                  <span className="text-sm font-medium text-gray-500">{ipo.score || '--'}/100</span>
                </div>
              </div>
            </Link>
          ))}
          
          {!loading && filteredIpos.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
              No IPOs found matching this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}