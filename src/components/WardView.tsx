"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, ChevronRight, Users, AlertTriangle } from 'lucide-react';


export const WardView = () => {
    const [depts, setDepts] = useState<any[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const FALLBACK = [
        { id: 'dept-1', name: 'Surgery', avgLOS: 12.4, occupancy: 88, backlogCount: 4 },
        { id: 'dept-2', name: 'Neurology', avgLOS: 9.1, occupancy: 92, backlogCount: 2 },
        { id: 'dept-3', name: 'Cardiology', avgLOS: 7.5, occupancy: 85, backlogCount: 1 },
        { id: 'dept-4', name: 'ICU', avgLOS: 14.8, occupancy: 95, backlogCount: 0 },
    ];

    useEffect(() => {
        fetch('http://localhost:8000/api/wards')
            .then(res => res.json())
            .then(data => {
                setDepts(Array.isArray(data) ? data : FALLBACK);
                setIsLoading(false);
            })
            .catch(() => {
                setDepts(FALLBACK);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="card"><p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>Loading ward data…</p></div>;
    }

    return (
        <div className="card">
            <h3 className="chart-title">Ward / Unit-Level View</h3>
            <div className="table-wrapper">
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Department</th>
                            <th>Avg Predicted LOS</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {depts.map((d) => (
                            <React.Fragment key={d.id}>
                                <tr
                                    onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}
                                    style={{ cursor: 'pointer', borderBottom: '1px solid var(--border-color)', backgroundColor: expandedId === d.id ? 'rgba(0,0,0,0.02)' : 'transparent' }}
                                >
                                    <td style={{ textAlign: 'center' }}>
                                        {expandedId === d.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{d.name}</td>
                                    <td>{d.avgLOS} days</td>
                                    <td>
                                        <span className={`badge ${d.occupancy > 90 ? 'danger' : 'success'}`}>
                                            {d.occupancy}% Occupied
                                        </span>
                                    </td>
                                </tr>
                                {expandedId === d.id && (
                                    <tr>
                                        <td colSpan={4} style={{ padding: 0 }}>
                                            <div style={{ backgroundColor: '#fafafa', padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', overflow: 'hidden' }}>

                                                {/* Occupancy Timeline */}
                                                <div style={{ minWidth: 0 }}>
                                                    <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Bed Occupancy Trends</h4>
                                                    <div style={{ height: '200px', width: '100%' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <LineChart data={d.occupancyTimeline || []} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                                <XAxis dataKey="day" style={{ fontSize: '0.75rem' }} />
                                                                <YAxis style={{ fontSize: '0.75rem' }} />
                                                                <Tooltip />
                                                                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                                                                <Line connectNulls={false} type="monotone" dataKey="actual" stroke="#1d2129" strokeWidth={2} name="Actual (beds)" />
                                                                <Line connectNulls={false} type="monotone" dataKey="predicted" stroke="#165dff" strokeWidth={2} strokeDasharray="5 5" name="Predicted (patient flow)" />
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>

                                                {/* Bottlenecks and Backlogs */}
                                                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    <div>
                                                        <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Bottleneck Identification</h4>
                                                        <div style={{ height: '120px', width: '100%' }}>
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <BarChart data={[
                                                                    { status: 'High Risk', count: d.backlogCount || 0 },
                                                                    { status: 'Pending Transfer', count: Math.max(0, (d.occupancyTimeline?.[6]?.predicted ?? 0) - (d.occupancyTimeline?.[4]?.predicted ?? 0)) },
                                                                    { status: 'Ready Discharge', count: Math.max(0, (d.occupancyTimeline?.[4]?.actual ?? 0) - (d.occupancyTimeline?.[5]?.predicted ?? 0)) },
                                                                ]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                                                    <XAxis type="number" style={{ fontSize: '0.75rem' }} />
                                                                    <YAxis dataKey="status" type="category" width={130} style={{ fontSize: '0.65rem' }} />
                                                                    <Tooltip />
                                                                    <Bar dataKey="count" fill="#ff7d00" radius={[0, 4, 4, 0]} />
                                                                </BarChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                                                        <AlertTriangle color="#f53f3f" size={24} />
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Patient Flow Prediction</div>
                                                            <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                                                                {d.backlogCount} high-risk · next stop: <span style={{ color: '#165dff' }}>{d.nextWard || 'Discharge'}</span>
                                                            </div>
                                                        </div>
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
