import Icons from '@/components/Icons';
import HeroCarousel from '@/components/HeroCarousel';
import BannerDecor from '@/components/BannerDecor';

export default function Hero() {
  return (
    <section className="hero-section" id="inicio">
      <BannerDecor />
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">Facilities & Manutenção Comercial</span>
          <h1 className="hero-title">
            Manutenção e instalações para <span className="text-gradient">o seu negócio</span>
          </h1>
          <p className="hero-subtitle">
            Cuidamos da estrutura de lojas, consultórios, escritórios e salas comerciais para você focar no seu negócio.
          </p>
          <p className="hero-description">
            Soluções técnicas para manutenção, instalações elétricas, iluminação, CFTV, segurança e infraestrutura de
            espaços comerciais.
          </p>

          <div className="hero-cta-group">
            <a href="/abrir-chamado" className="btn btn-primary" id="cta-hero-solicitar">
              <Icons name="calendar" /> ABRIR CHAMADO
            </a>
            <a
              href="https://wa.me/5511980604534?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20WA%20Sol%C3%A7%C3%B5es%20Integradas%20e%20gostaria%20de%20solicitar%20um%20atendimento%20para%20minha%20loja."
              target="_blank"
              rel="noopener"
              className="btn btn-secondary"
              id="cta-hero-whatsapp"
            >
              <Icons name="message-square" /> FALE PELO WHATSAPP
            </a>
          </div>

          <div className="hero-features">
            <div className="hero-feat-item">
              <Icons name="shield-check" className="feat-icon" />
              <span>Atendimento Exclusivo B2B</span>
            </div>
            <div className="hero-feat-item">
              <Icons name="clock" className="feat-icon" />
              <span>Foco em Agilidade</span>
            </div>
            <div className="hero-feat-item">
              <Icons name="wrench" className="feat-icon" />
              <span>Suporte Integrado</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="image-border-glow"></div>
          <HeroCarousel />
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
