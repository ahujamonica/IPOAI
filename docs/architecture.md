# Architecture Decisions

## AWS services used
| Service | Purpose |
|---|---|
| Amazon Nova Lite (Bedrock) | DRHP summarisation, plain-English analysis |
| Amazon Titan Embeddings V2 (Bedrock) | Text to vectors for RAG pipeline |
| AWS S3 | DRHP PDF storage |
| AWS RDS PostgreSQL | IPO data, financials, risk scores |

## Non-AWS tools (all free)
| Tool | Purpose |
|---|---|
| pdfplumber | Extract text and tables from DRHP PDFs |
| XGBoost + SHAP | Risk scoring with explainability |
| FinBERT | News sentiment analysis |
| VADER | Social media sentiment analysis |
| sentence-transformers | Local backup embeddings |
| FastAPI | Backend API |
| React + Vite | Frontend dashboard |
| Celery + Redis | Background job queue |
| requests + BeautifulSoup | SEBI scraper |

## Why Nova Lite over Nova Pro
- 10x cheaper — $0.03 per DRHP vs $0.15
- Quality difference is negligible for structured summarisation
- Same API, same setup — can upgrade anytime

## Why pdfplumber over Amazon Textract
- SEBI DRHPs are digital PDFs — not scanned images
- pdfplumber extracts text and tables accurately from digital PDFs
- Completely free — saves ~$28 for 50 DRHPs
- Textract added later as fallback only if scanned PDFs encountered

## Why RAG over fine-tuning
- Every DRHP is a unique document
- RAG injects relevant chunks per query — no retraining needed
- Nova Lite stays frozen — only the retrieved chunks change per IPO

## Why XGBoost over deep learning
- ~700 labelled Indian IPOs available (2017–2024)
- XGBoost works best on small tabular datasets
- SHAP provides explainable per-feature risk breakdown
- Deep learning needs 10,000+ examples to generalise

## Why sentence-transformers as Titan backup
- Runs locally — zero API cost
- all-MiniLM-L6-v2 is fast and accurate for chunked DRHP text
- Activates automatically if Titan hits rate limits

## AWS region: ap-south-1 (Mumbai)
- Lowest latency from India
- All required Bedrock models available in this region

## Data sources
- SEBI EFTS portal — public DRHP PDFs
- NSE/BSE — subscription and listing data
- NewsAPI — news sentiment
- Reddit r/IndiaInvestments — social signals

## Cost estimate
- Nova Lite: ~$0.03 per DRHP
- Titan Embeddings: ~$0.01 per DRHP
- S3: negligible
- RDS: free tier
- Total: ~$0.04 per DRHP processed