import Icons from '@/components/Icons';

const STEPS = [
  { number: '01', icon: 'phone-call', title: '01. Solicitação', desc: 'O cliente entra em contato pelo WhatsApp ou formulário.' },
  { number: '02', icon: 'search', title: '02. Diagnóstico', desc: 'Nossa equipe entende o problema e identifica a necessidade do serviço.' },
  { number: '03', icon: 'check-square', title: '03. Atendimento', desc: 'O profissional realiza o serviço ou manutenção necessária.' },
  { number: '04', icon: 'thumbs-up', title: '04. Loja funcionando', desc: 'A estrutura volta a operar corretamente com segurança e qualidade.' },
];

export default function ComoFunciona() {
  return (
    <section className="como-funciona-section" id="como-funciona">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Processo Simples</span>
          <h2 className="section-title">Como funciona</h2>
          <p className="section-desc">
            Estruturamos nosso fluxo de atendimento em etapas claras para garantir agilidade e resolução sem
            burocracia.
          </p>
        </div>

        <div className="process-steps">
          {STEPS.map((step) => (
            <div className="step-card scroll-reveal" key={step.number}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <Icons name={step.icon} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
