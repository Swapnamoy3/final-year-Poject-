"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronRight, Activity } from 'lucide-react';

const mockCurveData = Array.from({ length: 20 }, (_, i) => ({
    days: i + 1,
    probability: Math.exp(-Math.pow(i + 1 - 8.5, 2) / 8) * 100,
}));

const FALLBACK_PATIENTS = [
    { id: 'P-186', name: 'Diana Penchen', admitDate: '2026-05-01', predictedLOS: 8.5, currentStay: 7, risk: 'High', factors: ['High Inflammation', 'Age > 65'] },
    { id: 'P-187', name: 'Robert King', admitDate: '2026-05-03', predictedLOS: 4.0, currentStay: 5, risk: 'Low', factors: ['Stable Vitals'] },
    { id: 'P-188', name: 'Anna Lee', admitDate: '2026-05-05', predictedLOS: 6.2, currentStay: 3, risk: 'Medium', factors: ['Minor infection', 'History of Asthma'] },
    { id: 'P-189', name: 'Sam Torres', admitDate: '2026-05-06', predictedLOS: 10.0, currentStay: 2, risk: 'High', factors: ['Liver Damage', 'Age > 65'] },
];

export const PatientView = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [sortField, setSortField] = useState<'predictedLOS' | 'risk' | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/patients')
            .then(res => res.json())
            .then(data => {
                setPatients(Array.isArray(data) ? data : FALLBACK_PATIENTS);
                setIsLoading(false);
            })
            .catch(() => {
                setPatients(FALLBACK_PATIENTS);
                setIsLoading(false);
            });
    }, []);

    const handleSort = (field: 'predictedLOS' | 'risk') => {
        const isAsc = sortField === field ? !sortAsc : true;
        setSortField(field);
        setSortAsc(isAsc);
        const sorted = [...patients].sort((a, b) => {
            if (field === 'predictedLOS') {
                return isAsc ? a.predictedLOS - b.predictedLOS : b.predictedLOS - a.predictedLOS;
            } else {
                const riskWeights: Record<string, number> = { 'Low': 1, 'Medium': 2, 'High': 3 };
                return isAsc ? riskWeights[a.risk] - riskWeights[b.risk] : riskWeights[b.risk] - riskWeights[a.risk];
            }
        });
        setPatients(sorted);
    };

    if (isLoading) {
        return (
            <div className="card" style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading patient data…</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h3 className="chart-title">Patient-Level View (Admitted)</h3>
            <div className="table-wrapper">
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Admit Date</th>
                            <th>Current Stay</th>
                            <th
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => handleSort('predictedLOS')}
                            >
                                Predicted LOS {sortField === 'predictedLOS' ? (sortAsc ? '↑' : '↓') : ''}
                            </th>
                            <th
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => handleSort('risk')}
                            >
                                Risk Level {sortField === 'risk' ? (sortAsc ? '↑' : '↓') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p) => (
                            <React.Fragment key={p.id}>
                                <tr
                                    onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                                    style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color)', backgroundColor: expandedId === p.id ? 'rgba(0,0,0,0.02)' : 'transparent' }}
                                >
                                    <td style={{ textAlign: 'center' }}>
                                        {expandedId === p.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </td>
                                    <td>{p.id}</td>
                                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                                    <td>{p.admitDate}</td>
                                    <td>{p.currentStay} days</td>
                                    <td>{Number(p.predictedLOS).toFixed(1)} days</td>
                                    <td>
                                        <span className={`badge ${p.risk === 'High' ? 'danger' : p.risk === 'Medium' ? 'warning' : 'success'}`}>
                                            {p.risk}
                                        </span>
                                    </td>
                                </tr>
                                {expandedId === p.id && (
                                    <tr>
                                        <td colSpan={7} style={{ padding: 0 }}>
                                            <div style={{ backgroundColor: '#fafafa', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Activity size={16} color="var(--primary-color)" /> Key Contributing Factors
                                                    </h4>
                                                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                        {p.factors?.map((f: string) => (
                                                            <li key={f} style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', padding: '0.5rem', borderRadius: '4px' }}>
                                                                {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Confidence Interval (Probability Area Curve)</h4>
                                                    <div style={{ height: '200px', width: '100%' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <AreaChart data={mockCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                <XAxis dataKey="days" />
                                                                <YAxis />
                                                                <Tooltip />
                                                                <Area type="monotone" dataKey="probability" stroke="#165dff" fill="#165dff" fillOpacity={0.2} name="Probability %" />
                                                            </AreaChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
