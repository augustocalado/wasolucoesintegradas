'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SiteLogo from '@/components/SiteLogo';
import Icons from '@/components/Icons';

export default function PortalHeader({ userName }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="portal-header">
      <div className="container portal-header-container">
        <a href="/" className="logo" aria-label="WA Soluções Integradas Home">
          <SiteLogo size={36} />
          <div className="logo-text">
            <span className="brand-name">WA</span>
            <span className="brand-sub">Soluções Integradas</span>
          </div>
        </a>
        <nav className="portal-nav">
          <span className="portal-welcome">Olá, {userName}</span>
          <a href="/abrir-chamado" className="btn btn-sm btn-primary">
            Abrir chamado
          </a>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <Icons name="log-out" size={15} /> Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
