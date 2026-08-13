import Link from 'next/link';
import Icons from '@/components/Icons';

const SERVICES = [
  {
    slug: 'instalacoes-eletricas',
    icon: 'zap',
    title: 'Instalações Elétricas',
    desc: 'Manutenção e instalação de infraestrutura elétrica para lojas, consultórios, escritórios e salas comerciais, incluindo tomadas, interruptores, circuitos, disjuntores, quadros elétricos e adequações técnicas de carga.',
  },
  {
    slug: 'iluminacao',
    icon: 'lightbulb',
    title: 'Iluminação',
    desc: 'Instalação, manutenção e substituição de luminárias, spots, painéis LED, iluminação comercial e correção de falhas.',
  },
  {
    slug: 'cftv-e-seguranca',
    icon: 'video',
    title: 'CFTV e Segurança',
    desc: 'Instalação e manutenção de câmeras, sistemas de CFTV e equipamentos de segurança para lojas e espaços comerciais.',
  },
  {
    slug: 'som-ambiente-e-microfone',
    icon: 'mic',
    title: 'Som Ambiente e Microfone',
    desc: 'Instalação de sistema de som ambiente, caixas acústicas, amplificadores e microfone para chamadas, avisos e atendimento em lojas.',
  },
  {
    slug: 'manutencao-preventiva',
    icon: 'shield',
    title: 'Manutenção Preventiva',
    desc: 'Inspeções e manutenção programada para reduzir falhas, paradas e problemas inesperados na operação do seu negócio.',
  },
  {
    slug: 'manutencao-corretiva',
    icon: 'activity',
    title: 'Manutenção Corretiva',
    desc: 'Atendimento técnico para solucionar problemas que estejam afetando o funcionamento do seu negócio.',
  },
  {
    slug: 'infraestrutura-comercial',
    icon: 'layout',
    title: 'Infraestrutura Comercial',
    desc: 'Instalações e adequações necessárias para manter a estrutura física e técnica da sua operação funcionando.',
  },
  {
    slug: 'hidraulica',
    icon: 'droplet',
    title: 'Hidráulica',
    desc: 'Manutenção hidráulica, reparos, substituições e adequações necessárias na infraestrutura de espaços comerciais.',
  },
  {
    slug: 'instalacoes-e-adequacoes',
    icon: 'layers',
    title: 'Instalações e Adequações',
    desc: 'Execução de instalações, ajustes e adequações técnicas para novos pontos comerciais, reformas e mudanças de layout.',
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
            Seu negócio não pode parar. A WA cuida da manutenção para sua operação continuar funcionando com máxima
            segurança e padrão técnico. Clique em cada serviço para ver mais detalhes.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <Link
              href={`/servicos/${service.slug}`}
              className="service-card scroll-reveal"
              key={service.slug}
              id={`card-${service.slug}`}
            >
              <div className="card-icon-box">
                <Icons name={service.icon} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="service-card-link">
                Ver detalhes <Icons name="arrow-right" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
