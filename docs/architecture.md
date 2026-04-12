# Architecture Decisions

## Why AWS Bedrock + Nova Pro
- Pay per token — no fixed model hosting cost
- 300K token context window handles full DRHPs
- SOC2 compliant — safe for financial data
- Titan Embeddings pairs natively for RAG pipeline

## Why RAG over fine-tuning
- Every DRHP is a different document
- RAG injects fresh chunks per query — no retraining needed
- Fine-tuning would require retraining for every new IPO filing

## Why XGBoost over deep learning
- Only ~700 labelled Indian IPOs available (2017–2024)
- XGBoost performs best on small tabular datasets
- SHAP gives explainable per-feature risk breakdown
- Deep learning needs 10,000+ samples to generalise

## Why Amazon Textract over open-source PDF parsers
- Handles scanned PDFs and complex table layouts
- Managed service — no server maintenance
- Outputs structured JSON with bounding boxes
- More reliable than pdfplumber on SEBI's mixed-format DRHPs

## AWS region: ap-south-1 (Mumbai)
- Lowest latency from India
- All required services available in this region

## Data sources
- SEBI EFTS portal — public DRHP PDFs
- NSE/BSE — subscription and listing data
- NewsAPI — news sentiment
- Reddit (r/IndiaInvestments) — social signals