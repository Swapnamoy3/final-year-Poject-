# 🏥 LOS Healthcare Dashboard

> An AI-powered, interactive **Length of Stay (LOS) prediction dashboard** built as a final year project. Uses real **MIMIC-III clinical data**, an **XGBoost** machine learning model, and a **Next.js** frontend to give hospital staff deep, explainable insights into patient flow and bed occupancy.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **AI-Powered Predictions** | XGBoost model trained on 10,000 MIMIC-III patients predicts LOS in days |
| 📊 **Confidence Intervals** | Upper and lower bounds shown for every prediction |
| 🧠 **SHAP Explainability** | Live SHAP values show which lab results are driving each prediction |
| 🛏️ **Bed Occupancy Timelines** | Per-ward actual → predicted occupancy charts (today + 2 days ahead) |
| 🔀 **Patient Flow Algorithm** | Care pathway routing: ICU → Surgery → General Medicine → Discharge |
| 🔎 **Patient View** | Sortable, expandable patient list with risk levels and probability curves |
| 🏥 **Ward View** | Department-level occupancy, bottlenecks, and patient flow predictions |
| 🎛️ **What-If Simulator** | Interactive sliders send real-time queries to the AI bridge |
| 📅 **Temporal Analytics** | Actual vs predicted LOS trends, error curves, and seasonal patterns |
| 📤 **Admin Panel** | Mock export and compliance reporting interface |

---

## 🏗️ Architecture

```
┌─────────────────────────┐       ┌──────────────────────────┐
│   Next.js Frontend      │◄─────►│  FastAPI Python Bridge   │
│   (localhost:3000)      │  HTTP │  (localhost:8000)        │
│                         │       │                          │
│  • PatientView          │       │  • /api/predict (SHAP)   │
│  • WardView             │       │  • /api/patients         │
│  • Explainability       │       │  • /api/wards            │
│  • Temporal Analytics   │       │  • XGBoost model.pkl     │
└─────────────────────────┘       └──────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MIMIC-III 10k dataset from [Kaggle](https://www.kaggle.com/datasets/bilal1907/mimic-iii-10k)

### 1. Clone the repository
```bash
git clone https://github.com/Swapnamoy3/final-year-Poject-.git
cd final-year-Poject-
```

### 2. Download the MIMIC-III dataset
```bash
mkdir -p data
curl -L -o data/mimic-iii-10k.zip \
  https://www.kaggle.com/api/v1/datasets/download/bilal1907/mimic-iii-10k
unzip data/mimic-iii-10k.zip -d data/
```

### 3. Set up the Python backend & train the model
```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python scripts/build_model.py   # ~30 seconds, creates backend/model.pkl
```

### 4. Start the AI Bridge
```bash
.venv/bin/python backend/main.py
# Runs on http://localhost:8000
```

### 5. Install frontend dependencies & start
```bash
npm install
npm run dev
# Opens on http://localhost:3000
```

---

## 📁 Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── patients/         # Patient View page
│   │   ├── wards/            # Ward View page
│   │   ├── temporal/         # Temporal Analytics page
│   │   ├── explainability/   # AI Sandbox page
│   │   ├── alerts/           # Decision Support page
│   │   └── admin/            # Admin Panel page
│   └── components/           # Re-usable React components
│       ├── PatientView.tsx
│       ├── WardView.tsx
│       ├── TemporalAnalytics.tsx
│       ├── ExplainabilityPanel.tsx
│       ├── AlertsPanel.tsx
│       ├── AdminPanel.tsx
│       ├── KPICards.tsx
│       └── Layout.tsx
├── backend/
│   └── main.py               # FastAPI bridge (serves AI predictions)
├── scripts/
│   └── build_model.py        # Full ML pipeline: data → model.pkl
├── requirements.txt          # Python dependencies
└── package.json              # Node.js dependencies
```

---

## 🤖 ML Pipeline Overview

1. **Data Assembly** — Merges `ADMISSIONS` + `LABEVENTS` from MIMIC-III; filters to 5 key lab markers (Glucose, Creatinine, WBC, Hematocrit, Hemoglobin)
2. **Windowing** — Groups events into 12-hour blocks; creates lag and delta features; calculates "time to discharge" target
3. **Training** — 80/20 patient-aware split; trains XGBoost regressor; generates SHAP `TreeExplainer`
4. **Export** — Saves model + test patient predictions + ward summaries + per-ward occupancy timelines into `backend/model.pkl`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Vanilla CSS |
| Charts | Recharts |
| Icons | Lucide React |
| ML Model | XGBoost |
| Explainability | SHAP |
| Data Processing | Pandas, NumPy |
| API Bridge | FastAPI, Uvicorn |
| Dataset | MIMIC-III (10k patients) |

---

## 📄 License

For academic / educational use only. MIMIC-III data requires a [PhysioNet credentialed account](https://physionet.org/content/mimiciii/).
