import Icons from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container footer-grid">
        <div className="footer-brand-box">
          <a href="#inicio" className="logo logo-footer" aria-label="WA Soluções Integradas Home">
            <svg className="logo-icon" width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#001f54" />
              <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            </svg>
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
