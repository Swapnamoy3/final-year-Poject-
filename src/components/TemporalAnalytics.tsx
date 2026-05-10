"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

export const TemporalAnalytics = () => {
    const [activeTab, setActiveTab] = useState<'trends' | 'error' | 'seasonality'>('trends');

    const trendData = [
        { month: 'Jan', actual: 10.2, predicted: 10.0 }, { month: 'Feb', actual: 9.9, predicted: 9.8 },
        { month: 'Mar', actual: 9.6, predicted: 9.5 }, { month: 'Apr', actual: 9.8, predicted: 9.6 },
        { month: 'May', actual: 9.5, predicted: 9.4 }, { month: 'Jun', actual: 9.2, predicted: 9.2 },
    ];

    const errorData = trendData.map(d => ({ month: d.month, error: d.actual - d.predicted }));

    const seasonalData = [
        { week: 'W1', actual: 8.5, predicted: 8.4 }, { week: 'W2', actual: 9.1, predicted: 9.0 },
        { week: 'W3', actual: 10.2, predicted: 9.8 }, { week: 'W4', actual: 8.8, predicted: 8.5 },
    ];

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="chart-title" style={{ margin: 0 }}>Temporal Analytics</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['trends', 'error', 'seasonality'].map((tab) => (
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

            <div className="chart-container">
                {activeTab === 'trends' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                            <YAxis domain={['auto', 'auto']} style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Line type="monotone" dataKey="actual" stroke="#1d2129" strokeWidth={2} name="Actual LOS" />
                            <Line type="monotone" dataKey="predicted" stroke="#165dff" strokeWidth={2} strokeDasharray="5 5" name="Predicted LOS" />
                        </LineChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'error' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={errorData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" style={{ fontSize: '0.75rem' }} />
                            <YAxis style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="error" stroke="#f53f3f" fill="#f53f3f" fillOpacity={0.2} name="Prediction Error (Days)" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}

                {activeTab === 'seasonality' && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="week" style={{ fontSize: '0.75rem' }} />
                            <YAxis domain={['auto', 'auto']} style={{ fontSize: '0.75rem' }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                            <Line type="monotone" dataKey="actual" stroke="#1d2129" strokeWidth={2} name="Actual Seasonal LOS" />
                            <Line type="monotone" dataKey="predicted" stroke="#165dff" strokeWidth={2} strokeDasharray="5 5" name="Predicted Seasonal LOS" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
