# 🏥 LOS Healthcare Dashboard

> An AI-powered, interactive **Length of Stay (LOS) prediction dashboard** built as a final year project. 

This dashboard helps hospital staff predict how long a patient will stay in the hospital (Length of Stay) using an Artificial Intelligence model (XGBoost). It uses real clinical data from the MIMIC-III database.

---

## 🚀 Quick Start (For Beginners)

**Good news:** You do *not* need to download the massive datasets or train the AI model yourself. The pre-trained AI brain (`model.pkl`) is already included in this repository!

### Step 1: Start the Python AI API (Backend)
This runs the Python server that serves the AI predictions.

1. Open your terminal and clone this repository:
   ```bash
   git clone https://github.com/Swapnamoy3/final-year-Poject-.git
   cd final-year-Poject-
   ```
2. Create a Python virtual environment and activate it:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the AI server:
   ```bash
   python backend/main.py
   ```
   *Leave this terminal window open! The API is now running on `http://localhost:8000`.*

### Step 2: Start the Web Dashboard (Frontend)
This runs the actual user interface.

1. Open a **new** terminal window and go to the project folder:
   ```bash
   cd path/to/final-year-Poject-
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the dashboard:
   ```bash
   npm run dev
   ```
4. 🎉 **Open your browser and go to [http://localhost:3000](http://localhost:3000)**

---

## ✨ Features

- 🔬 **AI-Powered Predictions**: Predicts Length of Stay in days using a trained XGBoost ML model.
- 🧠 **Explainability (SHAP)**: Shows *why* the AI made a prediction by highlighting the exact lab results (e.g. Glucose, WBC) that influenced it.
- 🛏️ **Bed Occupancy Trends**: Predicts future hospital bed occupancy and patient flow.
- 🔀 **Patient Flow**: Automatically predicts where a patient will be transferred next (e.g. ICU → Surgery).
- 🔎 **Real Data Testing**: The dashboard displays 30 real patients taken exclusively from the **20% held-out test set** of the MIMIC-III data, ensuring the predictions you see evaluate real unseen data.

---

## 🔁 Want to Re-Train the AI? (Advanced)

If you want to train the model from scratch on your own machine:

1. Download the MIMIC-III 10k dataset from [Kaggle](https://www.kaggle.com/datasets/bilal1907/mimic-iii-10k)
2. Extract the CSV files into a folder named `data/` inside this project.
3. Run the training script:
   ```bash
   source .venv/bin/activate
   python scripts/build_model.py
   ```
This will process the data, train a new model, evaluate it on a 20% test split, and overwrite `backend/model.pkl` with your freshly trained model and test patients.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (React), Vanilla CSS, Recharts
- **Backend / API**: FastAPI (Python), Uvicorn
- **Machine Learning**: XGBoost, SHAP, Pandas, Scikit-Learn
- **Dataset**: MIMIC-III (10,000 patients)

---

## 📄 License & Data

For academic / educational use only. Usage of raw MIMIC-III data requires a [PhysioNet credentialed account](https://physionet.org/content/mimiciii/).
