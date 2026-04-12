# IPOAI — AI-Powered IPO Risk Analyser

An AI-powered IPO risk analysis platform built for Indian retail investors.
Automatically reads SEBI DRHP filings and delivers plain-English risk summaries.

## What it does
- Scrapes DRHP filings from SEBI automatically
- Extracts text and tables from PDFs using pdfplumber
- Scores IPO risk using XGBoost + SHAP
- Generates plain-English summaries using Amazon Nova Lite (AWS Bedrock)
- Analyses news sentiment using FinBERT
- Analyses social media sentiment using VADER
- Displays everything on a React dashboard with comparison tools

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind + Recharts |
| Backend | Python + FastAPI |
| AI / LLM | AWS Bedrock — Amazon Nova Lite |
| Embeddings | Amazon Titan Embeddings V2 |
| PDF reading | pdfplumber (free) |
| ML model | XGBoost + SHAP |
| NLP / Sentiment | FinBERT + VADER |
| Database | PostgreSQL on AWS RDS |
| Storage | AWS S3 |
| Task queue | Celery + Redis |
| Scraping | requests + BeautifulSoup |

## Project structure
IPOAI/
├── frontend/        # React dashboard
├── backend/
│   ├── app/         # FastAPI routes and models
│   ├── scrapers/    # SEBI/BSE/NSE scrapers
│   ├── ml/          # Risk scoring model
│   ├── nlp/         # DRHP parsing + sentiment
│   └── tasks/       # Celery async jobs
├── ml/
│   ├── models/      # Saved trained model files
│   ├── data/        # Training datasets
│   └── notebooks/   # Jupyter experiments
├── infra/           # Docker + deployment configs
└── docs/            # Architecture and setup docs

## Cost estimate
| Scale | Total AWS cost |
|---|---|
| 200 DRHPs (testing) | ~$8 |
| 500 DRHPs (full project) | ~$20 |
| 1000 DRHPs (production) | ~$41 |

## Setup
See `docs/setup.md` for full instructions.