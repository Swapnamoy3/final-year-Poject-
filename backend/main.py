from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import shap
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("backend/model.pkl", "rb") as f:
    brain = pickle.load(f)
model = brain['model']
features = brain['features']
explainer = brain['explainer']
dashboard_patients = brain.get('dashboard_patients', [])
dashboard_wards = brain.get('dashboard_wards', [])

class PatientData(BaseModel):
    glucose: float
    creatinine: float
    wbc: float
    hematocrit: float
    hemoglobin: float

@app.post("/api/predict")
def predict_los(data: PatientData):
    input_dict = {
        'Glucose': data.glucose,
        'Creatinine': data.creatinine,
        'WBC': data.wbc,
        'Hematocrit': data.hematocrit,
        'Hemoglobin': data.hemoglobin
    }
    
    for col in ['Glucose', 'Creatinine', 'WBC', 'Hematocrit', 'Hemoglobin']:
        input_dict[f"{col}_lag1"] = input_dict[col]
        input_dict[f"{col}_change"] = 0.0
        
    x_array = []
    for f in features:
        x_array.append(input_dict.get(f, 0.0))
        
    x = np.array([x_array])
    pred = float(model.predict(x)[0])
    shap_vals = explainer(x).values[0]
    
    importance = []
    for feat_name, shap_val in zip(features, shap_vals):
        if "_change" not in feat_name and "_lag" not in feat_name:
            importance.append({
                "factor": feat_name,
                "impact": float(shap_val)
            })
            
    return {
        "prediction": pred,
        "ci_lower": max(0.5, pred - 1.2),
        "ci_upper": pred + 1.8,
        "shap_importance": importance
    }

# Mocking the actual aggregated tables from MIMIC to serve to the dashboard rapidly
@app.get("/api/patients")
def get_patients():
    return dashboard_patients

@app.get("/api/wards")
def get_wards():
    return dashboard_wards

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
