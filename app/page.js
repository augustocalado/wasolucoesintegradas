import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappFloat from '@/components/WhatsappFloat';
import RevealObserver from '@/components/RevealObserver';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Diferenciais from '@/components/sections/Diferenciais';
import ComoFunciona from '@/components/sections/ComoFunciona';
import Corporativo from '@/components/sections/Corporativo';
import Solucoes from '@/components/sections/Solucoes';
import OndeAtendemos from '@/components/sections/OndeAtendemos';
import Faq from '@/components/sections/Faq';
import Solicitacao from '@/components/sections/Solicitacao';

const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.wasolucoesintegradas.com.br/#business',
  name: 'WA Soluções Integradas',
  description:
    'Manutenção e instalações para lojas de varejo. Soluções elétricas, iluminação, CFTV, hidráulica, infraestrutura e suporte técnico B2B.',
  image: 'https://www.wasolucoesintegradas.com.br/assets/images/hero.png',
  url: 'https://www.wasolucoesintegradas.com.br/',
  telephone: '+5511980604534',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'São Paulo',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-23.550520',
    longitude: '-46.633308',
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'São Paulo e Região Metropolitana',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+5511980604534',
    contactType: 'customer service',
    availableLanguage: 'pt-BR',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
  sameAs: [],
};

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.wasolucoesintegradas.com.br/#website',
  url: 'https://www.wasolucoesintegradas.com.br/',
  name: 'WA Soluções Integradas',
  description:
    'Manutenção e instalações para lojas de varejo em São Paulo. Facilities B2B para redes e operações comerciais.',
  inLanguage: 'pt-BR',
  publisher: {
    '@id': 'https://www.wasolucoesintegradas.com.br/#business',
  },
};

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quais serviços a WA Soluções Integradas oferece?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Instalações elétricas, iluminação, CFTV e segurança, manutenção preventiva e corretiva, hidráulica e infraestrutura para lojas de varejo e operações comerciais.',
      },
    },
    {
      '@type': 'Question',
      name: 'A WA atende residências ou pequenos reparos domésticos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. Nosso atendimento é exclusivamente B2B, focado em lojas, redes de varejo e operações comerciais. Não atuamos como marido de aluguel ou eletricista residencial.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual é a área de atendimento da WA Soluções Integradas?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Atendemos lojas em São Paulo, capital e região metropolitana. Para redes com múltiplos pontos comerciais, consulte nossa equipe sobre a viabilidade em outras localidades.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como funciona o processo de atendimento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '1) Solicitação via WhatsApp ou formulário. 2) Diagnóstico do problema. 3) Atendimento técnico. 4) Loja em pleno funcionamento com segurança e qualidade.',
      },
    },
    {
      '@type': 'Question',
      name: 'Vocês realizam manutenção preventiva recorrente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Oferecemos inspeções e manutenção programada para reduzir falhas, paradas e problemas inesperados na operação da loja.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como solicito um orçamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Preencha o formulário de solicitação no site ou fale conosco diretamente pelo WhatsApp +55 11 98060-4534.',
      },
    },
  ],
};

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Services />
        <Diferenciais />
        <ComoFunciona />
        <Corporativo />
        <Solucoes />
        <OndeAtendemos />
        <Faq />
        <Solicitacao />
      </main>

      <Footer />
      <WhatsappFloat />
      <RevealObserver />

      <JsonLd data={LOCAL_BUSINESS_JSON_LD} />
      <JsonLd data={WEBSITE_JSON_LD} />
      <JsonLd data={FAQ_JSON_LD} />
    </>
  );
}
