'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

let cachedLogo = null;

function DefaultMark({ size, variant }) {
  if (variant === 'footer') {
    return (
      <svg className="logo-icon" width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#001f54" />
        <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="logo-icon" width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );
}

export default function SiteLogo({ size = 40, variant = 'header' }) {
  const [logoUrl, setLogoUrl] = useState(cachedLogo);

  useEffect(() => {
    if (cachedLogo !== null) {
      setLogoUrl(cachedLogo);
      return;
    }
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        cachedLogo = data?.value || '';
        setLogoUrl(cachedLogo);
      })
      .catch(() => {
        if (!cancelled) setLogoUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (logoUrl) {
    return (
      <img
        className={`logo-icon logo-img${variant === 'footer' ? ' logo-img-footer' : ''}`}
        src={logoUrl}
        alt="WA Soluções Integradas"
        width={size}
        height={size}
      />
    );
  }

  return <DefaultMark size={size} variant={variant} />;
}
