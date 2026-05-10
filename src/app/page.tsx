import { KPICards } from '@/components/KPICards';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Overview Dashboard</h2>
        <p style={{ opacity: 0.9 }}>Welcome to the Reveal LSO dashboard. Select a specialized view from the sidebar to inspect detailed analytics.</p>
      </div>
      <KPICards />
    </div>
  );
}
