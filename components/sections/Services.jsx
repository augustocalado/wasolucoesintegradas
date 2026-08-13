import Icons from '@/components/Icons';

const SERVICES = [
  {
    icon: 'zap',
    title: 'Instalações Elétricas',
    desc: 'Manutenção e instalação de infraestrutura elétrica para lojas, incluindo tomadas, interruptores, circuitos, disjuntores, quadros elétricos e adequações técnicas de carga.',
  },
  {
    icon: 'lightbulb',
    title: 'Iluminação',
    desc: 'Instalação, manutenção e substituição de luminárias, spots, painéis LED, iluminação comercial e correção de falhas.',
  },
  {
    icon: 'video',
    title: 'CFTV e Segurança',
    desc: 'Instalação e manutenção de câmeras, sistemas de CFTV e equipamentos de segurança para lojas.',
  },
  {
    icon: 'shield',
    title: 'Manutenção Preventiva',
    desc: 'Inspeções e manutenção programada para reduzir falhas, paradas e problemas inesperados na operação da loja.',
  },
  {
    icon: 'activity',
    title: 'Manutenção Corretiva',
    desc: 'Atendimento técnico para solucionar problemas que estejam afetando o funcionamento da loja.',
  },
  {
    icon: 'layout',
    title: 'Infraestrutura de Loja',
    desc: 'Instalações e adequações necessárias para manter a estrutura física e técnica da operação funcionando.',
  },
  {
    icon: 'droplet',
    title: 'Hidráulica',
    desc: 'Manutenção hidráulica, reparos, substituições e adequações necessárias na infraestrutura das lojas.',
  },
  {
    icon: 'layers',
    title: 'Instalações e Adequações',
    desc: 'Execução de instalações, ajustes e adequações técnicas para novas lojas, reformas e mudanças de layout.',
  },
];

export default function Services() {
  return (
    <section className="services-section" id="servicos">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Soluções Corporativas</span>
          <h2 className="section-title">Nossos Serviços</h2>
          <p className="section-desc">
            Sua loja não pode parar. A WA cuida da manutenção para sua operação continuar funcionando com máxima
            segurança e padrão técnico.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <div className="service-card scroll-reveal" key={service.title}>
              <div className="card-icon-box">
                <Icons name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
