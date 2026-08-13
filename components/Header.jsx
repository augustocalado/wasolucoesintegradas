'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Icons from '@/components/Icons';

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#diferenciais', label: 'Por que a WA?' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#corporativo', label: 'Empresas' },
  { href: '#onde-atendemos', label: 'Atendimento' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const linkHref = (href) => (isHome ? href : `/${href}`);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      let currentId = '';
      const pos = window.scrollY + 140;
      document.querySelectorAll('section[id]').forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (pos >= top && pos < top + height) currentId = section.id;
      });

      document.querySelectorAll('.nav-link').forEach((link) => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className={`main-header${scrolled ? ' scrolled' : ''}`} id="header">
      <div className="container header-container">
        <a href={isHome ? '#inicio' : '/'} className="logo" aria-label="WA Soluções Integradas Home">
          <svg className="logo-icon" width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="url(#logo-grad)" />
            <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0a1128" />
                <stop offset="1" stopColor="#001f54" />
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text">
            <span className="brand-name">WA</span>
            <span className="brand-sub">Soluções Integradas</span>
          </div>
        </a>

        <nav className="desktop-nav" aria-label="Menu Principal" ref={navRef}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={linkHref(link.href)} className="nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="/abrir-chamado" className="btn btn-sm btn-outline">
            Abrir Chamado
          </a>
          <button
            className={`menu-toggle${menuOpen ? ' active' : ''}`}
            id="menu-toggle"
            aria-label="Abrir Menu de Navegação"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? ' active' : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
        <nav className="mobile-nav" aria-label="Menu Mobile">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={linkHref(link.href)} className="mobile-link" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/abrir-chamado" className="mobile-link btn btn-primary" onClick={() => setMenuOpen(false)}>
                Abrir Chamado
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
