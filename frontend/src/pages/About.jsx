export default function About() {
  const techStack = [
    'React + Vite', 'FastAPI', 'AWS Bedrock', 'Amazon Nova Pro', 
    'Titan Embeddings', 'Amazon Textract', 'Amazon Comprehend', 
    'XGBoost + SHAP', 'FinBERT', 'LangChain RAG', 'Amazon RDS', 
    'OpenSearch', 'Amazon S3', 'AWS ECS Fargate'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">About IPOLens</h1>
        <p className="text-gray-500 text-sm">AI-powered IPO analysis for Indian retail investors</p>
      </div>

      <div className="space-y-6">
        {/* Section 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What is IPOLens?</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            IPOLens is an AI-driven decision support platform that automatically reads DRHP documents filed with SEBI, 
            extracts financial data, calculates a risk score using machine learning, analyses news sentiment, 
            and presents everything in simple plain English. Our goal is to give every retail investor access 
            to the same quality of analysis that institutional investors pay thousands of rupees for.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">How does the risk score work?</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            Our XGBoost machine learning model is trained on historical Indian IPOs. For each IPO we recorded 
            18 financial ratios (net margin, debt-equity, ROE, revenue CAGR, P/E ratio etc.) and labelled them based on 30-day post-listing performance. 
            The model learned what "Low risk" vs "High risk" IPOs look like. SHAP values then explain why a 
            particular score was given — so you understand the reasoning, not just the number.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tech stack powering IPOLens</h2>
          <p className="text-gray-500 text-xs mb-4">Built entirely on AWS student credits — zero cost to build and run at student scale.</p>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}