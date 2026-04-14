import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export default function IpoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('AI summary');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    details: null,
    summary: null,
    risk: null,
  });

  useEffect(() => {
    const fetchAllIpoData = async () => {
      setLoading(true);
      try {
        // We use Promise.all to fetch everything at exactly the same time
        const [detailsRes, summaryRes, riskRes] = await Promise.all([
          api.getIpoDetails(id).catch(() => ({})), 
          api.getIpoSummary(id).catch(() => ({})),
          api.getIpoRisk(id).catch(() => ({}))
        ]);

        setData({
          details: detailsRes,
          summary: summaryRes,
          risk: riskRes,
        });
      } catch (error) {
        console.error("Failed to fetch IPO details", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllIpoData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Extracting DRHP insights...</div>
      </div>
    );
  }

  // Fallbacks in case the API doesn't have data yet
  const details = data.details || { name: 'Unknown Company', sector: 'Unknown' };
  const summary = data.summary || { analysis: 'Analysis unavailable.', verdict: 'Hold' };
  const risk = data.risk || { score: 50, level: 'Medium risk' };

  const tabs = ['AI summary', 'Financials', 'Risk factors', 'Sentiment'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </button>

      {/* Top Section: Company Info & Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Company Info Card */}
        <div className="md:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start space-x-4">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-xl font-bold border border-gray-200 shrink-0">
                {id.substring(0, 3).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{details.name}</h1>
                <p className="text-gray-500">{details.sector} • NSE + BSE</p>
              </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-100">
              {details.status || 'Open'}
            </span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200">
              {details.dateRange || 'Dates TBA'}
            </span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200">
              {details.priceBand || 'Price TBA'}
            </span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200">
              Lot: {details.lotSize || 'TBA'}
            </span>
            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-sm border border-gray-200">
              Issue size: {details.issue_size || 'TBA'}
            </span>
          </div>
        </div>

        {/* Risk Score Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">AI Risk Score</h3>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
            risk.score < 40 ? 'border-green-400 text-green-600' : 
            risk.score < 70 ? 'border-yellow-400 text-yellow-600' : 'border-red-400 text-red-600'
          }`}>
            <div className="text-center">
              <span className="text-3xl font-bold block leading-none">{risk.score}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          </div>
          <p className="mt-4 font-medium text-gray-800">{risk.level}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {activeTab === 'AI summary' && (
          <div className="p-0">
            {/* Analysis Section */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Amazon Nova Pro — Plain English Analysis</h3>
              <p className="text-gray-700 leading-relaxed">
                {summary.analysis || "GSP Crop Science is one of India's leading agro-chemical manufacturers... (Backend integration pending)."}
              </p>
            </div>
            
            {/* Verdict Section */}
            <div className="p-6 bg-white text-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Verdict</h3>
              <p className={`text-xl font-bold ${
                summary.verdict === 'Invest' ? 'text-green-600' : 
                summary.verdict === 'Avoid' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {summary.verdict}
              </p>
            </div>
          </div>
        )}

        {activeTab !== 'AI summary' && (
          <div className="p-10 text-center text-gray-500">
            {activeTab} data integration pending from backend.
          </div>
        )}
      </div>
      
      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Generated by Amazon Nova Pro via RAG — based on {details.name} DRHP · Not financial advice
      </p>
    </div>
  );
}