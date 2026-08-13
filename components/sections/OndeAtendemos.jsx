import Icons from '@/components/Icons';

export default function OndeAtendemos() {
  return (
    <section className="onde-atendemos-section" id="onde-atendemos">
      <div className="container">
        <div className="onde-atendemos-box">
          <div className="onde-text">
            <span className="section-tag">Área de Atendimento</span>
            <h2 className="section-title">ONDE ATENDEMOS</h2>
            <p>
              A WA Soluções Integradas atende lojas e empresas de varejo em São Paulo (capital e região metropolitana).
              Oferecemos soluções integradas com suporte contínuo para manter sua operação no rumo certo.
            </p>
            <div className="coverage-area">
              <h3>Atendimento em</h3>
              <ul className="coverage-chips">
                <li>São Paulo - Capital</li>
                <li>Grande São Paulo (Região Metropolitana)</li>
              </ul>
            </div>
            <p className="onde-highlights">
              Para clientes corporativos e redes com múltiplos pontos comerciais, consulte nossa equipe sobre a
              viabilidade e disponibilidade técnica para atendimento integrado em outras localidades.
            </p>
            <div className="onde-alert">
              <Icons name="info" />{' '}
              <span>Se sua loja fica em outra cidade, entre em contato pelo WhatsApp e verifique a possibilidade de atendimento técnico no local.</span>
            </div>
          </div>
          <div className="onde-visual">
            <div className="map-placeholder">
              <div className="radar-pulse"></div>
              <div className="radar-dot"></div>
              <Icons name="map-pin" className="map-icon" size={40} />
              <span className="map-label">Central WA ativa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
