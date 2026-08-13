import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappFloat from '@/components/WhatsappFloat';
import RevealObserver from '@/components/RevealObserver';
import BannerDecor from '@/components/BannerDecor';
import Icons from '@/components/Icons';
import { SERVICOS, getServico } from '@/lib/servicos';
import { buildWhatsappLink } from '@/lib/whatsapp';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICOS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) return {};

  return {
    title: servico.metaTitle,
    description: servico.metaDescription,
    keywords: servico.keywords,
    alternates: {
      canonical: `/servicos/${servico.slug}/`,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'WA Soluções Integradas',
      url: `https://www.wasolucoesintegradas.com.br/servicos/${servico.slug}/`,
      title: servico.metaTitle,
      description: servico.metaDescription,
    },
  };
}

export default async function ServicoPage({ params }) {
  const { slug } = await params;
  const servico = getServico(slug);
  if (!servico) notFound();

  return (
    <>
      <Header />

      <main>
        <section className="servico-hero">
          <BannerDecor />
          <div className="container">
            <nav className="breadcrumb" aria-label="Trilha de navegação">
              <a href="/">Início</a>
              <span>/</span>
              <a href="/#servicos">Serviços</a>
              <span>/</span>
              <span className="breadcrumb-current">{servico.cardTitle}</span>
            </nav>
            <div className="servico-hero-icon">
              <Icons name={servico.icon} size={40} />
            </div>
            <span className="section-tag">Serviço Especializado</span>
            <h1 className="hero-title">{servico.pageTitle}</h1>
            <p className="hero-subtitle">{servico.intro}</p>
            <div className="hero-cta-group">
              <a href="/abrir-chamado" className="btn btn-primary" id={`cta-${servico.slug}-chamado`}>
                <Icons name="calendar" /> ABRIR CHAMADO
              </a>
              <a
                href={buildWhatsappLink(
                  `Olá, vim pelo site da WA Soluções Integradas e gostaria de solicitar o serviço de ${servico.cardTitle}.`
                )}
                target="_blank"
                rel="noopener"
                className="btn btn-secondary"
                id={`cta-${servico.slug}-whatsapp`}
              >
                <Icons name="message-square" /> FALE PELO WHATSAPP
              </a>
            </div>
          </div>
        </section>

        <section className="servico-conteudo">
          <div className="container">
            <div className="servico-texto scroll-reveal">
              {servico.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="servico-secao-titulo scroll-reveal">
              <span className="section-tag">Benefícios</span>
              <h2 className="section-title">Por que contratar este serviço?</h2>
            </div>

            <div className="servico-beneficios-grid">
              {servico.beneficios.map((b) => (
                <div className="servico-beneficio-card scroll-reveal" key={b.t}>
                  <div className="diff-icon-circle">
                    <Icons name="check" />
                  </div>
                  <h4>{b.t}</h4>
                  <p>{b.d}</p>
                </div>
              ))}
            </div>

            <div className="servico-ideais scroll-reveal">
              <h3>Ideal para</h3>
              <ul>
                {servico.ideaisPara.map((item) => (
                  <li key={item}>
                    <Icons name="check" className="corp-list-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="servico-cta-box scroll-reveal">
              <div className="servico-cta-content">
                <h2>Precisa de {servico.cardTitle.toLowerCase()}?</h2>
                <p>
                  Abra um chamado e nossa equipe técnica entrará em contato para agendar o atendimento na sua loja,
                  consultório ou escritório.
                </p>
              </div>
              <a href="/abrir-chamado" className="btn btn-primary btn-lg">
                <Icons name="calendar" /> ABRIR CHAMADO
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsappFloat />
      <RevealObserver />
    </>
  );
}
