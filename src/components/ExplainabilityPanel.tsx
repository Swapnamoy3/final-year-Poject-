"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { ArrowRight, Info, Activity } from 'lucide-react';

export const ExplainabilityPanel = () => {
    const [activeTab, setActiveTab] = useState<'importance' | 'timeline' | 'counterfactual' | 'simulator'>('simulator');
    const [sliderData, setSliderData] = useState({ glucose: 100, creatinine: 1.0, wbc: 8.0, hematocrit: 40.0, hemoglobin: 14.0 });
    const [prediction, setPrediction] = useState<{ prediction: number, ci_lower: number, ci_upper: number, shap_importance: any[] } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPrediction = async () => {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:8000/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sliderData)
                });
                const data = await res.json();
                setPrediction(data);
            } catch (error) {
                console.error("API Bridge offline:", error);
            }
            setLoading(false);
        };
        const timeout = setTimeout(fetchPrediction, 300);
        return () => clearTimeout(timeout);
    }, [sliderData]);

    const handleSlider = (key: string, val: number) => {
        setSliderData(prev => ({ ...prev, [key]: val }));
    };

    const timelineData = [
        { day: 'Admit', predicted: 8.5 },
        { day: 'Day 1', predicted: 9.0 },
        { day: 'Day 2 (Lab test)', predicted: 11.2 },
        { day: 'Day 3 (Intervention)', predicted: 9.5 },
        { day: 'Day 4', predicted: prediction?.prediction || 8.8 },
    ];

    const modelFeatures = prediction?.shap_importance || [
        { factor: 'Glucose', impact: 0 },
        { factor: 'Creatinine', impact: 0 },
        { factor: 'WBC', impact: 0 },
    ];

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="chart-title" style={{ margin: 0 }}>Brain-in-a-Jar (XGBoost)</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['simulator', 'importance', 'timeline', 'counterfactual'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            style={{
                                padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--border-color)',
                                backgroundColor: activeTab === tab ? '#165dff' : '#fff',
                                color: activeTab === tab ? '#fff' : 'var(--text-primary)',
                                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-container" style={{ minHeight: '350px' }}>

                {activeTab === 'simulator' && (
                    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4 style={{ fontSize: '0.875rem' }}>What-If Parameters</h4>
                            {[['glucose', 50, 300], ['creatinine', 0.1, 10.0], ['wbc', 0, 50], ['hematocrit', 10, 60], ['hemoglobin', 3, 20]].map(([key, min, max]) => (
                                <div key={key as string} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ textTransform: 'capitalize' }}>{key as string}</span>
                                        <span style={{ fontWeight: 600 }}>{sliderData[key as keyof typeof sliderData]}</span>
                                    </label>
                                    <input
                                        type="range" min={min as number} max={max as number} step={0.1}
                                        value={sliderData[key as keyof typeof sliderData]}
                                        onChange={e => handleSlider(key as string, parseFloat(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#f4f6f9', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <Activity size={32} color={loading ? '#86909c' : '#165dff'} style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Predicted Length of Stay</div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {prediction ? prediction.prediction.toFixed(1) : '--'} <span style={{ fontSize: '1rem' }}>days</span>
                            </div>
                            {prediction && (
                                <div style={{ fontSize: '0.875rem', color: '#00b42a', marginTop: '0.5rem', fontWeight: 500 }}>
                                    Confidence Interval: [{prediction.ci_lower.toFixed(1)} - {prediction.ci_upper.toFixed(1)}]
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'importance' && (
                    <div style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={modelFeatures} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" style={{ fontSize: '0.75rem' }} />
                                <YAxis dataKey="factor" type="category" width={110} style={{ fontSize: '0.75rem' }} />
                                <Tooltip />
                                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                                    {modelFeatures.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#f53f3f' : '#00b42a'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'auto' }}>
                            <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Live SHAP values retrieved from FastAPI bridge.
                        </div>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={timelineData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" style={{ fontSize: '0.75rem' }} />
                            <YAxis domain={['auto', 'auto']} style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Line type="stepAfter" dataKey="predicted" stroke="#165dff" strokeWidth={2} name="Predicted LOS (Days)" />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'counterfactual' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '6px' }}>
                            Use the Simulator tab to interactively explore counterfactuals!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
