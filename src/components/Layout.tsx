"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, FileText, AlertCircle, BarChart2, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', icon: LayoutDashboard, label: 'Overview' },
        { href: '/patients', icon: Users, label: 'Patient View' },
        { href: '/wards', icon: Activity, label: 'Ward View' },
        { href: '/temporal', icon: BarChart2, label: 'Temporal Analytics' },
        { href: '/explainability', icon: FileText, label: 'Explainability Sandbox' },
        { href: '/alerts', icon: AlertCircle, label: 'Alerts & Decision Support' },
        { href: '/admin', icon: ShieldCheck, label: 'Administrative Panel' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Activity size={24} color="#165dff" />
                <span>Reveal LSO</span>
            </div>
            <ul className="nav-menu">
                {menuItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    </li>
                ))}
                <li style={{ marginTop: 'auto' }}>
                    <a className="nav-item" style={{ textDecoration: 'none' }}>
                        <Settings size={20} />
                        Settings
                    </a>
                </li>
            </ul>
        </aside>
    );
};

const Header = () => {
    const pathname = usePathname();
    const titles: Record<string, string> = {
        '/': 'LOS Operation Dashboard - Overview',
        '/patients': 'Patient-Level Dashboard',
        '/wards': 'Ward & Unit Dashboard',
        '/temporal': 'Temporal Analytics Dashboard',
        '/explainability': 'Explainability Sandbox Dashboard',
        '/alerts': 'Alerts & Decision Support Dashboard',
        '/admin': 'Administrative & Export Dashboard',
    };

    return (
        <header className="header">
            <h1 className="page-title">{titles[pathname] || 'Dashboard'}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Hospital Admin</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#165dff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
            </div>
        </header>
    );
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};
