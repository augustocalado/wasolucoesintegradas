import './globals.css';

const FAVICON_SVG = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%230a1128'/><path d='M25 35 L40 70 L50 48 L60 70 L75 35' stroke='%2300f0ff' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' fill='none'/><path d='M42 55 L58 55' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' fill='none'/></svg>"
);

export const metadata = {
  metadataBase: new URL('https://www.wasolucoesintegradas.com.br'),
  title: 'WA Soluções Integradas | Manutenção para Lojas, Consultórios e Escritórios em São Paulo',
  description:
    'Manutenção e instalações para lojas, consultórios, escritórios e salas comerciais em São Paulo. Soluções elétricas, iluminação, CFTV, hidráulica, infraestrutura e suporte técnico B2B.',
  keywords: [
    'manutenção comercial',
    'manutenção preventiva',
    'instalações elétricas comerciais',
    'CFTV lojas',
    'infraestrutura comercial',
    'som ambiente loja',
    'suporte técnico B2B',
    'facilities comercial',
    'manutenção loja São Paulo',
    'manutenção consultório',
    'manutenção escritório',
    'salas comerciais',
  ],
  authors: [{ name: 'WA Soluções Integradas' }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'WA Soluções Integradas',
    url: 'https://www.wasolucoesintegradas.com.br/',
    title: 'WA Soluções Integradas | Manutenção para Lojas, Consultórios e Escritórios em São Paulo',
    description:
      'Manutenção e instalações para lojas, consultórios, escritórios e salas comerciais. Soluções elétricas, iluminação, CFTV, hidráulica, infraestrutura e suporte técnico B2B para empresas.',
    images: [
      {
        url: 'https://www.wasolucoesintegradas.com.br/assets/images/hero.png',
        alt: 'Interior moderno e iluminado de uma loja de varejo atendida pela WA Soluções Integradas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WA Soluções Integradas | Manutenção para Lojas, Consultórios e Escritórios em São Paulo',
    description:
      'Manutenção e instalações para lojas, consultórios, escritórios e salas comerciais. Soluções elétricas, iluminação, CFTV, hidráulica, infraestrutura e suporte técnico B2B para empresas.',
    images: ['https://www.wasolucoesintegradas.com.br/assets/images/hero.png'],
  },
  icons: {
    icon: `data:image/svg+xml,${FAVICON_SVG}`,
  },
};

export const viewport = {
  themeColor: '#0a1128',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
