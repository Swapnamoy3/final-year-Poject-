import React from 'react';
import { Download, FileText, Activity, ShieldCheck } from 'lucide-react';

export const AdminPanel = () => {
    return (
        <div className="card">
            <h3 className="chart-title">Administrative & Export Panel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }} className="hoverable-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <FileText color="#165dff" />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Hospital Management Report</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly LOS performance summary</div>
                            </div>
                        </div>
                        <Download size={18} color="var(--text-secondary)" />
                    </div>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }} className="hoverable-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity color="#00b42a" />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Model Performance Logs</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AUC, MAE, and RMSE metrics history</div>
                            </div>
                        </div>
                        <Download size={18} color="var(--text-secondary)" />
                    </div>
                </div>

                <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer' }} className="hoverable-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ShieldCheck color="#ff7d00" />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Compliance & Audit Data</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>HIPAA compliant anonymized export</div>
                            </div>
                        </div>
                        <Download size={18} color="var(--text-secondary)" />
                    </div>
                </div>

            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .hoverable-box:hover {
          background-color: #f4f6f9;
        }
      `}} />
        </div>
    );
};
