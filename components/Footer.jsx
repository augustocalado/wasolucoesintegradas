import Icons from '@/components/Icons';
import SiteLogo from '@/components/SiteLogo';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand-box">
          <a href="#inicio" className="logo logo-footer" aria-label="WA Soluções Integradas Home">
            <SiteLogo size={35} variant="footer" />
            <div className="logo-text">
              <span className="brand-name">WA</span>
              <span className="brand-sub text-white">Soluções Integradas</span>
            </div>
          </a>
          <p className="footer-desc">
            WA Soluções Integradas. Manutenção e instalações para lojas de varejo. Mantendo a estrutura física e
            técnica do seu negócio sempre em perfeito funcionamento.
          </p>
          <div className="footer-socials">
            <span className="social-placeholder-label">Redes Sociais:</span>
            <div className="social-icons-row">
              <span className="social-empty">Instagram e LinkedIn em breve</span>
            </div>
          </div>
        </div>

        <div className="footer-links-box">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#inicio">Início</a></li>
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#diferenciais">Sobre nós</a></li>
            <li><a href="#onde-atendemos">Atendimento</a></li>
            <li><a href="#faq">Perguntas frequentes</a></li>
            <li><a href="#solicitacao">Contato</a></li>
          </ul>
        </div>

        <div className="footer-contact-box">
          <h4>Contato</h4>
          <ul className="contact-list">
            <li>
              <Icons name="message-square" />
              <span>
                WhatsApp:{' '}
                <a href="https://wa.me/5511980604534" target="_blank" rel="noopener">
                  +55 11 98060-4534
                </a>
              </span>
            </li>
            <li>
              <Icons name="globe" />
              <span>
                Site:{' '}
                <a href="https://www.wasolucoesintegradas.com.br/" target="_blank" rel="noopener">
                  www.wasolucoesintegradas.com.br
                </a>
              </span>
            </li>
          </ul>
        </div>

        <div className="footer-legal-box">
          <h4>Dados Corporativos</h4>
          <ul className="legal-list">
            <li><span className="legal-placeholder">CNPJ: [Inserir futuramente]</span></li>
            <li><span className="legal-placeholder">Endereço: [Inserir futuramente]</span></li>
            <li><span className="legal-placeholder">E-mail: [Inserir futuramente]</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p>&copy; 2026 WA Soluções Integradas. Todos os direitos reservados. Projetado para Varejo B2B.</p>
          <a href="#inicio" className="back-to-top" aria-label="Voltar para o topo">
            <span>Topo</span> <Icons name="arrow-up" />
          </a>
        </div>
      </div>
    </footer>
  );
}
