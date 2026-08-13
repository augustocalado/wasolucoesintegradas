import Icons from '@/components/Icons';

const DIFERENCIAIS = [
  { icon: 'store', title: 'Atendimento especializado para empresas', desc: 'Conhecemos as necessidades e urgências de lojas, consultórios, escritórios e salas comerciais.' },
  { icon: 'zap', title: 'Agilidade', desc: 'Atendimento rápido para reduzir o tempo de negócio parado.' },
  { icon: 'users', title: 'Profissionais capacitados', desc: 'Serviços executados com organização, segurança e padrão profissional.' },
  { icon: 'shuffle', title: 'Soluções integradas', desc: 'Diversos serviços técnicos centralizados em uma única empresa.' },
  { icon: 'building', title: 'Foco empresarial', desc: 'Atendimento direcionado para empresas, lojas, consultórios e salas comerciais.' },
  { icon: 'check-circle2', title: 'Compromisso com o funcionamento do seu negócio', desc: 'Nosso objetivo é resolver o problema e manter a operação funcionando.' },
];

export default function Diferenciais() {
  return (
    <section className="diferenciais-section" id="diferenciais">
      <div className="container">
        <div className="diferenciais-wrapper">
          <div className="diferenciais-content">
            <span className="section-tag tag-white">Diferenciais Competitivos</span>
            <h2 className="section-title text-white">Por que escolher a WA?</h2>
            <p className="section-desc text-muted">
              Construímos parcerias sólidas com empresas através de um atendimento técnico, organizado e voltado para as
              necessidades corporativas.
            </p>

            <div className="diferenciais-grid">
              {DIFERENCIAIS.map((item) => (
                <div className="diferencial-item scroll-reveal" key={item.title}>
                  <div className="diff-icon-circle">
                    <Icons name={item.icon} />
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
