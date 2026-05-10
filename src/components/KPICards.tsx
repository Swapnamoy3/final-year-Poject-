import { ReactNode } from 'react';

export const KPICards = () => {
    const metrics = [
        { title: "Length of Stay (Avg)", value: "9.80", change: "+0.16", pct: "+2.10%", positive: false },
        { title: "Overall Patient Satisfaction", value: "78.51%", change: "+4.10%", pct: "+5.15%", positive: true },
        { title: "DCOH (Days Cash on Hand)", value: "84.2", change: "+1.2", pct: "+1.4%", positive: true },
        { title: "Likely to Recommend", value: "91.40%", change: "Target Met", pct: "+2.15%", positive: true },
        { title: "Hospital Acquired Condition", value: "4.56%", change: "-0.07%", pct: "-3.20%", positive: true },
    ];

    return (
        <div className="kpi-grid">
            {metrics.map((m, i) => (
                <div key={i} className="card kpi-card">
                    <div className="kpi-title">{m.title}</div>
                    <div className="kpi-value-row">
                        <span className="kpi-value">{m.value}</span>
                        <span className={`kpi-change ${m.positive ? 'positive' : 'negative'}`}>
                            {m.change} ({m.pct})
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
