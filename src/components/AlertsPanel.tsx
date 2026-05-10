import React from 'react';

export const AlertsPanel = () => {
    const alerts = [
        { type: 'danger', patient: 'Diana Penchen', message: 'Risk of prolonged stay. High Inflammation detected.', id: 'P-186' },
        { type: 'warning', patient: 'John Doe', message: 'Discharge readiness pending AUC consultation.', id: 'P-204' },
        { type: 'success', patient: 'Jane Smith', message: 'Ready for discharge. Vitals stable.', id: 'P-112' },
    ];

    return (
        <div className="card">
            <h3 className="chart-title">Decision Support & Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.map((alert, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{alert.patient} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>({alert.id})</span></div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{alert.message}</div>
                        </div>
                        <span className={`badge ${alert.type}`}>{alert.type === 'danger' ? 'High Risk' : alert.type === 'warning' ? 'Attention' : 'Cleared'}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
