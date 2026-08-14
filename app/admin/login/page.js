'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError('E-mail ou senha inválidos. Verifique e tente novamente.');
      return;
    }

    const role = data.user?.user_metadata?.role || 'admin';
    router.push(role === 'cliente' ? '/minha-area' : '/admin');
    router.refresh();
  }

  return (
    <div className="admin-body admin-login-page">
      <div className="admin-login-card">
        <div className="admin-logo">
          <svg className="logo-icon" width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="20" fill="url(#admin-grad)" />
            <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <defs>
              <linearGradient id="admin-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0a1128" />
                <stop offset="1" stopColor="#001f54" />
              </linearGradient>
            </defs>
          </svg>
          <div className="logo-text">
            <span className="brand-name">WA</span>
            <span className="brand-sub">Painel Administrativo</span>
          </div>
        </div>

        <h1>Acesso restrito</h1>
        <p>Entre com suas credenciais para gerenciar chamados, clientes, produtos, fornecedores e orçamentos.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>

        <p className="admin-login-back">
          <a href="/">← Voltar para o site</a>
        </p>
      </div>
    </div>
  );
}
