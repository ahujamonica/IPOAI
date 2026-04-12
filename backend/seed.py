from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import IPO, Base
from dotenv import load_dotenv
import os

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

ipos = [
    IPO(
        id="gsp", name="GSP Crop Science", sector="Agrochemical",
        status="open", risk="low", score=72,
        issue_size="₹500 Cr", price_band="₹160–170", subscribed="3.2x",
        revenue_cagr="18.2%", net_margin="11.4%", ebitda_margin="17.8%",
        roe="21.3%", debt_equity="0.42x", pe="18.4x"
    ),
    IPO(
        id="techcorp", name="TechCorp Solutions", sector="SaaS / IT",
        status="upcoming", risk="high", score=31,
        issue_size="₹850 Cr", price_band="₹220–240", subscribed="—",
        revenue_cagr="22.1%", net_margin="-4.3%", ebitda_margin="3.2%",
        roe="3.2%", debt_equity="2.3x", pe="87.5x"
    ),
    IPO(
        id="pharma", name="Zenith Pharma", sector="Pharmaceuticals",
        status="closed", risk="low", score=78,
        issue_size="₹680 Cr", price_band="₹310–330", subscribed="7.4x",
        revenue_cagr="21.3%", net_margin="14.2%", ebitda_margin="22.6%",
        roe="18.9%", debt_equity="0.28x", pe="22.4x"
    ),
    IPO(
        id="steel", name="Bharat Steel Works", sector="Manufacturing",
        status="upcoming", risk="medium", score=61,
        issue_size="₹2400 Cr", price_band="₹95–105", subscribed="—",
        revenue_cagr="12.4%", net_margin="7.8%", ebitda_margin="14.2%",
        roe="14.6%", debt_equity="0.71x", pe="12.8x"
    ),
]

for ipo in ipos:
    existing = db.query(IPO).filter(IPO.id == ipo.id).first()
    if not existing:
        db.add(ipo)

db.commit()
db.close()
print("4 IPOs inserted into database successfully!")