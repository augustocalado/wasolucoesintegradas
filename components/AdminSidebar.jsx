'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AdminLogout from '@/components/AdminLogout';
import Icons from '@/components/Icons';

const NAV = [
  { href: '/admin', label: 'Chamados', icon: 'clipboard-list' },
  { href: '/admin/orcamentos', label: 'Orçamentos', icon: 'file-text' },
  { href: '/admin/clientes', label: 'Clientes', icon: 'users' },
  { href: '/admin/produtos', label: 'Produtos', icon: 'package' },
  { href: '/admin/fornecedores', label: 'Fornecedores', icon: 'truck' },
];

export default function AdminSidebar({ userEmail, userName }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/';
    return pathname.startsWith(href);
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        <svg className="logo-icon" width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="url(#admin-grad3)" />
          <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
          <defs>
            <linearGradient id="admin-grad3" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0a1128" />
              <stop offset="1" stopColor="#001f54" />
            </linearGradient>
          </defs>
        </svg>
        <span className="admin-brand-text">
          <strong>WA</strong>
          <small>Painel</small>
        </span>
      </Link>

      <nav className="admin-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-link${isActive(item.href) ? ' active' : ''}`}
          >
            <Icons name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-sidebar-user">
          <div className="admin-avatar">{userName?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div className="admin-sidebar-user-info">
            <strong>{userName}</strong>
            <small>{userEmail}</small>
          </div>
        </div>
        <div className="admin-sidebar-actions">
          <a href="/" target="_blank" rel="noopener" className="admin-view-site">
            <Icons name="globe" size={16} /> Ver site
          </a>
          <AdminLogout />
        </div>
      </div>
    </aside>
  );
}
