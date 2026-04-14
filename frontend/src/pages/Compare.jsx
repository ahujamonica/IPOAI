import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Compare() {
  const [ipos, setIpos] = useState([]);
  const [ipoOne, setIpoOne] = useState('');
  const [ipoTwo, setIpoTwo] = useState('');
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch the list of available IPOs for the dropdowns
  useEffect(() => {
    const fetchIpoList = async () => {
      try {
        const data = await api.getIpos();
        setIpos(data || []);
        // Auto-select the first two if they exist
        if (data.length > 0) setIpoOne(data[0].id);
        if (data.length > 1) setIpoTwo(data[1].id);
      } catch (error) {
        console.error("Failed to load IPOs", error);
      }
    };
    fetchIpoList();
  }, []);

  // 2. Fetch comparison data whenever the selected IDs change
  useEffect(() => {
    const fetchComparison = async () => {
      if (!ipoOne || !ipoTwo) return;
      
      setLoading(true);
      try {
        // Hitting the POST /api/compare endpoint your teammate built
        const result = await api.compareIpos([ipoOne, ipoTwo]);
        setCompareData(result);
      } catch (error) {
        console.error("Comparison failed", error);
        // Fallback dummy data so you can see the UI while backend is wired up
        setCompareData([
          { id: ipoOne, name: ipoOne, sector: 'Sector TBA', issuePrice: 'TBA', margin: 'TBA', roe: 'TBA', debtEquity: 'TBA', pe: 'TBA', cagr: 'TBA', risk: 'TBA' },
          { id: ipoTwo, name: ipoTwo, sector: 'Sector TBA', issuePrice: 'TBA', margin: 'TBA', roe: 'TBA', debtEquity: 'TBA', pe: 'TBA', cagr: 'TBA', risk: 'TBA' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [ipoOne, ipoTwo]);

  // Helper to color-code metrics (Green for good, Red for bad)
  const getMetricColor = (val1, val2, invert = false) => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);
    if (isNaN(num1) || isNaN(num2)) return "text-gray-700";
    
    // For things like Margin/ROE, higher is better. For P/E or Debt, lower is better (invert=true)
    if (num1 === num2) return "text-gray-700";
    const isFirstBetter = invert ? num1 < num2 : num1 > num2;
    return isFirstBetter ? "text-green-600 font-medium" : "text-red-500 font-medium";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Compare IPOs</h1>
        <p className="text-gray-500 text-sm">Side-by-side fundamental comparison</p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <select 
          value={ipoOne}
          onChange={(e) => setIpoOne(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
        >
          {ipos.map(ipo => <option key={`left-${ipo.id}`} value={ipo.id}>{ipo.name}</option>)}
        </select>
        
        <select 
          value={ipoTwo}
          onChange={(e) => setIpoTwo(e.target.value)}
          className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
        >
          {ipos.map(ipo => <option key={`right-${ipo.id}`} value={ipo.id}>{ipo.name}</option>)}
        </select>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 backdrop-blur-sm">
             <span className="text-gray-600 font-medium">Crunching data...</span>
          </div>
        )}

        {compareData && compareData.length >= 2 && (
          <div className="divide-y divide-gray-100">
            {/* Header row (Sectors) */}
            <div className="grid grid-cols-2 text-center p-4 bg-gray-50/50">
              <div className="text-gray-600 text-sm">{compareData[0].sector}</div>
              <div className="text-gray-600 text-sm border-l border-gray-200">{compareData[1].sector}</div>
            </div>

            {/* Metrics Rows */}
            {[
              { label: 'Issue price', key: 'issuePrice' },
              { label: 'Issue size', key: 'issueSize' },
              { label: 'Net margin', key: 'margin' },
              { label: 'ROE', key: 'roe' },
              { label: 'Debt/Equity', key: 'debtEquity', invert: true },
              { label: 'P/E ratio', key: 'pe', invert: true },
              { label: 'Revenue CAGR', key: 'cagr' },
              { label: 'ML risk score', key: 'risk', invert: true },
            ].map((metric) => (
              <div key={metric.label} className="p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">{metric.label}</div>
                <div className="grid grid-cols-2 text-center text-lg">
                  <div className={getMetricColor(compareData[0][metric.key], compareData[1][metric.key], metric.invert)}>
                    {compareData[0][metric.key] || '-'}
                  </div>
                  <div className={`border-l border-gray-200 ${getMetricColor(compareData[1][metric.key], compareData[0][metric.key], metric.invert)}`}>
                    {compareData[1][metric.key] || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}