from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import boto3
import os
from datetime import datetime

load_dotenv()

app = FastAPI(title="IPOAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class IPO(Base):
    __tablename__ = "ipos"
    id            = Column(String, primary_key=True)
    name          = Column(String)
    sector        = Column(String)
    status        = Column(String)
    risk          = Column(String)
    score         = Column(Integer)
    issue_size    = Column(String)
    price_band    = Column(String)
    subscribed    = Column(String)
    revenue_cagr  = Column(String)
    net_margin    = Column(String)
    ebitda_margin = Column(String)
    roe           = Column(String)
    debt_equity   = Column(String)
    pe            = Column(String)
    ai_summary    = Column(Text, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

@app.get("/")
def root():
    return {"message": "IPOAI API is running"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/ipos")
def list_ipos():
    db = SessionLocal()
    ipos = db.query(IPO).all()
    db.close()
    return ipos

@app.get("/api/ipos/{ipo_id}")
def get_ipo(ipo_id: str):
    db = SessionLocal()
    ipo = db.query(IPO).filter(IPO.id == ipo_id).first()
    db.close()
    if not ipo:
        raise HTTPException(status_code=404, detail="IPO not found")
    return ipo

@app.get("/api/ipos/{ipo_id}/summary")
def get_summary(ipo_id: str):
    db = SessionLocal()
    ipo = db.query(IPO).filter(IPO.id == ipo_id).first()
    db.close()
    if not ipo:
        raise HTTPException(status_code=404, detail="IPO not found")

    if ipo.ai_summary:
        return {"ipo_id": ipo_id, "company": ipo.name, "summary": ipo.ai_summary, "cached": True}

    prompt = f"""You are an expert Indian financial analyst helping retail investors.
Analyse this IPO and give a clear, simple summary.

Company: {ipo.name}
Sector: {ipo.sector}
Issue Size: {ipo.issue_size}
Price Band: {ipo.price_band}
Revenue CAGR: {ipo.revenue_cagr}
Net Margin: {ipo.net_margin}
EBITDA Margin: {ipo.ebitda_margin}
ROE: {ipo.roe}
Debt to Equity: {ipo.debt_equity}
P/E Ratio: {ipo.pe}
Risk Score: {ipo.score}/100 ({ipo.risk} risk)

Write exactly in this format:

SUMMARY:
(3 sentences in simple English explaining what this company does and whether it looks like a good investment)

GROWTH DRIVERS:
- (driver 1)
- (driver 2)
- (driver 3)

KEY RISKS:
- (risk 1)
- (risk 2)
- (risk 3)

VERDICT:
(One line - should a retail investor APPLY or AVOID and why)
"""

    summary_text = None
    source = "nova"

    try:
        response = bedrock.converse(
            modelId="apac.amazon.nova-lite-v1:0",
            messages=[{"role": "user", "content": [{"text": prompt}]}],
            inferenceConfig={"maxTokens": 600, "temperature": 0.3}
        )
        summary_text = response["output"]["message"]["content"][0]["text"]

    except Exception as nova_error:
        if any(x in str(nova_error) for x in [
            "ThrottlingException", "Too many tokens",
            "ValidationException", "ServiceUnavailable", "ModelError"
        ]):
            source = "fallback"
            pe_val = float(ipo.pe.replace("x", ""))
            valuation = (
                "reasonably valued" if pe_val < 25
                else "moderately priced" if pe_val < 50
                else "aggressively priced"
            )
            verdict = (
                "APPLY" if ipo.risk == "low"
                else "CONSIDER" if ipo.risk == "medium"
                else "AVOID"
            )
            reason = (
                "strong fundamentals and low risk profile" if ipo.risk == "low"
                else "moderate risk — evaluate sector outlook before applying" if ipo.risk == "medium"
                else "high risk score and weak fundamentals"
            )

            summary_text = f"""SUMMARY:
{ipo.name} is a {ipo.sector} company filing for an IPO at a price band of {ipo.price_band} with an issue size of {ipo.issue_size}. The company has delivered {ipo.revenue_cagr} revenue CAGR with net margins of {ipo.net_margin} and ROE of {ipo.roe}, making it {valuation} at a P/E of {ipo.pe}. With a risk score of {ipo.score}/100 and debt-to-equity of {ipo.debt_equity}, this IPO presents a {ipo.risk} risk opportunity for retail investors.

GROWTH DRIVERS:
- Revenue CAGR of {ipo.revenue_cagr} demonstrates consistent business growth in the {ipo.sector} sector
- Strong return on equity of {ipo.roe} indicates efficient use of shareholder capital
- EBITDA margin of {ipo.ebitda_margin} reflects healthy operational profitability

KEY RISKS:
- P/E of {ipo.pe} requires sustained earnings growth to justify current valuation
- Debt-to-equity of {ipo.debt_equity} must be monitored for future borrowing capacity
- Sector-specific regulatory and market risks apply to all {ipo.sector} companies

VERDICT:
{verdict} — {ipo.name} shows {reason}. Risk score: {ipo.score}/100.

Note: Full AI analysis via Amazon Nova will replace this summary automatically once available."""

        else:
            raise HTTPException(status_code=500, detail=f"Bedrock error: {str(nova_error)}")

    if summary_text:
        db = SessionLocal()
        ipo_obj = db.query(IPO).filter(IPO.id == ipo_id).first()
        ipo_obj.ai_summary = summary_text
        db.commit()
        db.close()

    return {
        "ipo_id": ipo_id,
        "company": ipo.name,
        "summary": summary_text,
        "source": source,
        "cached": False
    }

@app.get("/api/ipos/{ipo_id}/risk")
def get_risk(ipo_id: str):
    db = SessionLocal()
    ipo = db.query(IPO).filter(IPO.id == ipo_id).first()
    db.close()
    if not ipo:
        raise HTTPException(status_code=404, detail="IPO not found")

    factors = []

    de = float(ipo.debt_equity.replace("x", ""))
    pe = float(ipo.pe.replace("x", ""))
    npm = float(ipo.net_margin.replace("%", ""))
    roe = float(ipo.roe.replace("%", ""))

    if de > 1.5:
        factors.append({
            "factor": "High Debt-to-Equity",
            "value": ipo.debt_equity,
            "impact": "negative",
            "explanation": f"D/E of {ipo.debt_equity} is above the safe threshold of 1.5x. High debt increases financial risk."
        })
    else:
        factors.append({
            "factor": "Healthy Debt-to-Equity",
            "value": ipo.debt_equity,
            "impact": "positive",
            "explanation": f"D/E of {ipo.debt_equity} is manageable and within safe limits."
        })

    if npm < 0:
        factors.append({
            "factor": "Negative Net Margin",
            "value": ipo.net_margin,
            "impact": "negative",
            "explanation": f"Company is loss-making with net margin of {ipo.net_margin}. Not yet profitable."
        })
    elif npm < 5:
        factors.append({
            "factor": "Thin Net Margin",
            "value": ipo.net_margin,
            "impact": "negative",
            "explanation": f"Net margin of {ipo.net_margin} is below 5% — very thin profitability."
        })
    else:
        factors.append({
            "factor": "Healthy Net Margin",
            "value": ipo.net_margin,
            "impact": "positive",
            "explanation": f"Net margin of {ipo.net_margin} indicates good profitability."
        })

    if pe > 50:
        factors.append({
            "factor": "High Valuation",
            "value": ipo.pe,
            "impact": "negative",
            "explanation": f"P/E of {ipo.pe} is very high. Company is priced aggressively — leaves little room for error."
        })
    elif pe > 30:
        factors.append({
            "factor": "Moderate Valuation",
            "value": ipo.pe,
            "impact": "neutral",
            "explanation": f"P/E of {ipo.pe} is moderately high. Growth must justify the premium."
        })
    else:
        factors.append({
            "factor": "Attractive Valuation",
            "value": ipo.pe,
            "impact": "positive",
            "explanation": f"P/E of {ipo.pe} is reasonable and attractively valued."
        })

    if roe > 15:
        factors.append({
            "factor": "Strong ROE",
            "value": ipo.roe,
            "impact": "positive",
            "explanation": f"ROE of {ipo.roe} shows management is generating strong returns on shareholder equity."
        })
    else:
        factors.append({
            "factor": "Weak ROE",
            "value": ipo.roe,
            "impact": "negative",
            "explanation": f"ROE of {ipo.roe} is below 15% — management is not generating enough returns."
        })

    if ipo.risk == "low":
        verdict = "This IPO shows strong fundamentals. Suitable for retail investors with moderate risk appetite."
    elif ipo.risk == "medium":
        verdict = "This IPO has mixed fundamentals. Suitable for investors who understand the sector risks."
    else:
        verdict = "This IPO carries significant risk. Only suitable for high risk tolerance investors."

    return {
        "ipo_id": ipo_id,
        "company": ipo.name,
        "risk_score": ipo.score,
        "risk_level": ipo.risk,
        "factors": factors,
        "verdict": verdict
    }

@app.post("/api/compare")
def compare_ipos(body: dict):
    ids = body.get("ids", [])
    if len(ids) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 IPO ids")
    db = SessionLocal()
    result = {}
    for ipo_id in ids:
        ipo = db.query(IPO).filter(IPO.id == ipo_id).first()
        if ipo:
            result[ipo_id] = {
                "name": ipo.name,
                "sector": ipo.sector,
                "risk": ipo.risk,
                "score": ipo.score,
                "issue_size": ipo.issue_size,
                "price_band": ipo.price_band,
                "revenue_cagr": ipo.revenue_cagr,
                "net_margin": ipo.net_margin,
                "roe": ipo.roe,
                "debt_equity": ipo.debt_equity,
                "pe": ipo.pe
            }
    db.close()
    return result