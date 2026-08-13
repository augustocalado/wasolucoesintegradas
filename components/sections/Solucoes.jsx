const SOLUCOES = [
  { emoji: '⚡', title: 'Elétrica', desc: 'Infraestrutura elétrica comercial completa, disjuntores, quadros e adequação de carga de forma segura.' },
  { emoji: '💡', title: 'Iluminação', desc: 'Manutenção, instalação e reposição de luminárias, painéis de LED e spots comerciais para PDV.' },
  { emoji: '📹', title: 'CFTV', desc: 'Instalação técnica e manutenção de câmeras e sistemas de CFTV dedicados à segurança da loja.' },
  { emoji: '🔧', title: 'Manutenção', desc: 'Suporte corretivo e preventivo focado em estabilidade física e no pleno funcionamento das operações.' },
  { emoji: '💧', title: 'Hidráulica', desc: 'Reparos hidráulicos comerciais rápidos, detecção de vazamentos e ajustes em instalações de uso comum.' },
  { emoji: '🏪', title: 'Infraestrutura de lojas', desc: 'Manutenção física e adequação contínua da estrutura das lojas para manter um padrão técnico elevado.' },
  { emoji: '🛠️', title: 'Instalações', desc: 'Adequação física do ponto comercial para receber novas operações ou realizar mudanças de layout.' },
  { emoji: '🏢', title: 'Atendimento empresarial', desc: 'Estrutura voltada a oferecer atendimento recorrente corporativo para manter sua rede funcionando.' },
];

export default function Solucoes() {
  return (
    <section className="solucoes-rapidas-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Visão Geral</span>
          <h2 className="section-title">Nossas Soluções</h2>
          <p className="section-desc">
            Especialidades técnicas executadas com rapidez e total conformidade técnica para sua operação.
          </p>
        </div>

        <div className="solucoes-grid">
          {SOLUCOES.map((solucao) => (
            <div className="solucao-card scroll-reveal" key={solucao.title}>
              <div className="sol-header">
                <span className="sol-emoji">{solucao.emoji}</span>
                <h3>{solucao.title}</h3>
              </div>
              <p>{solucao.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
