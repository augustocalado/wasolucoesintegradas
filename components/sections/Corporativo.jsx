import Icons from '@/components/Icons';

const CORP_LIST = [
  'Atendimento para lojas de varejo',
  'Manutenção preventiva e corretiva',
  'Instalações',
  'Adequações',
  'Suporte técnico',
  'Atendimento recorrente',
  'Possibilidade de atendimento em múltiplas lojas',
];

export default function Corporativo() {
  return (
    <section className="corporativo-section" id="corporativo">
      <div className="container">
        <div className="corp-grid">
          <div className="corp-content">
            <span className="section-tag">Parceria Corporativa B2B</span>
            <h2 className="section-title">SUA REDE DE LOJAS PRECISA DE UM PARCEIRO DE MANUTENÇÃO?</h2>
            <p className="corp-lead-text">
              A WA Soluções Integradas oferece suporte técnico para empresas que precisam manter suas lojas
              funcionando, reduzindo problemas de infraestrutura e agilizando a resolução de ocorrências.
            </p>

            <ul className="corp-list">
              {CORP_LIST.map((item) => (
                <li key={item}>
                  <Icons name="check" className="corp-list-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="corp-cta">
              <a href="#solicitacao" className="btn btn-primary" id="cta-corporativo-solicitar">
                <Icons name="building" /> SOLICITAR ATENDIMENTO EMPRESARIAL
              </a>
            </div>
          </div>

          <div className="corp-badge-card">
            <div className="badge-content">
              <div className="badge-icon-box">
                <Icons name="briefcase" />
              </div>
              <h3>Foco Empresarial B2B</h3>
              <p>
                Nosso posicionamento é estritamente voltado a atender empresas, redes de lojas e operações
                comerciais. Não nos apresentamos nem atuamos como marido de aluguel, assistência residencial,
                pequenos reparos domésticos ou eletricista residencial. Entregamos a seriedade técnica e a organização
                contratual exigida por redes corporativas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
