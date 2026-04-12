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
- AWS keys from IAM user
- RDS database URL
- S3 bucket name

## 4. Frontend setup
cd frontend
npm install
npm run dev

## 5. AWS services required
- S3 bucket: ipo-analyser-drhps (ap-south-1)
- RDS PostgreSQL: free tier, db.t3.micro
- Bedrock models enabled: Nova Pro, Nova Lite, Titan Embeddings V2
- Textract: enabled by default

## 6. Run backend locally
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload