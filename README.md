# IPOAI — AI-Powered IPO Risk Analyser

An AI-powered IPO risk analysis platform built for Indian retail investors.
Automatically reads SEBI DRHP filings and delivers plain-English risk summaries.

## What it does
- Scrapes DRHP filings from SEBI automatically
- Extracts financial data using Amazon Textract
- Scores IPO risk using XGBoost + SHAP
- Generates plain-English summaries using Amazon Nova Pro (AWS Bedrock)
- Displays analysis on a React dashboard with comparison tools

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind + Recharts |
| Backend | Python + FastAPI |
| AI / LLM | AWS Bedrock — Amazon Nova Pro |
| PDF reading | Amazon Textract |
| Embeddings | Amazon Titan Embeddings V2 |
| ML model | XGBoost + SHAP |
| NLP | FinBERT + VADER |
| Database | PostgreSQL on AWS RDS |
| Storage | AWS S3 |
| Task queue | Celery + Redis |

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

## Setup
See `docs/setup.md` for full setup instructions.