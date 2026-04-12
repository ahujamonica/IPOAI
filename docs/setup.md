# Setup Guide

## Prerequisites
- Python 3.11+
- Node.js 20+
- Git
- AWS CLI configured with ap-south-1 region

## 1. Clone the repo
git clone https://github.com/ahujamonica/IPOAI.git
cd IPOAI

## 2. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

## 3. Environment variables
Copy .env.example to .env and fill in your values:
cp .env.example .env

Fill in:
- AWS_ACCESS_KEY_ID — from IAM user ipo-dev
- AWS_SECRET_ACCESS_KEY — from IAM user ipo-dev
- DATABASE_URL — from RDS instance endpoint

## 4. Frontend setup
cd ../frontend
npm install
npm run dev

## 5. AWS services required
- S3 bucket: ipo-analyser-drhps (ap-south-1) — already created
- RDS PostgreSQL: free tier db.t3.micro
- Bedrock: Nova Lite + Titan Embeddings V2 — auto enabled

## 6. Run backend locally
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

## AWS cost summary
- Nova Lite (Bedrock): ~$0.03 per DRHP
- Titan Embeddings (Bedrock): ~$0.01 per DRHP
- S3 storage: negligible
- RDS: free tier
- Estimated total for 500 DRHPs: ~$20