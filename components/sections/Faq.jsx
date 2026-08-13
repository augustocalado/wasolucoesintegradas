const FAQ_ITEMS = [
  {
    q: 'Quais serviços a WA Soluções Integradas oferece?',
    a: 'Instalações elétricas, iluminação, CFTV e segurança, manutenção preventiva e corretiva, hidráulica e infraestrutura para lojas de varejo e operações comerciais.',
  },
  {
    q: 'A WA atende residências ou pequenos reparos domésticos?',
    a: 'Não. Nosso atendimento é exclusivamente B2B, focado em lojas, redes de varejo e operações comerciais. Não atuamos como marido de aluguel, assistência residencial ou eletricista doméstico.',
  },
  {
    q: 'Qual é a área de atendimento da WA?',
    a: 'Atendemos lojas em São Paulo, capital e região metropolitana. Para redes com múltiplos pontos comerciais em outras cidades, consulte nossa equipe sobre a viabilidade técnica.',
  },
  {
    q: 'Como funciona o processo de atendimento?',
    a: '1) Você solicita pelo WhatsApp ou formulário. 2) Nossa equipe faz o diagnóstico. 3) O profissional realiza o serviço. 4) Sua loja volta a operar com segurança e qualidade.',
  },
  {
    q: 'Vocês realizam manutenção preventiva recorrente?',
    a: 'Sim. Oferecemos inspeções e manutenção programada para reduzir falhas, paradas e problemas inesperados na operação da loja.',
  },
  {
    q: 'Qual o prazo para atender uma loja parada?',
    a: 'Chamados com loja parada têm prioridade no agendamento. Entre em contato pelo WhatsApp +55 11 98060-4534 para uma análise rápida do caso.',
  },
  {
    q: 'Como solicito um orçamento?',
    a: 'Preencha o formulário de solicitação nesta página ou fale conosco diretamente pelo WhatsApp +55 11 98060-4534. Retornaremos em instantes.',
  },
];

export default function Faq() {
  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Dúvidas Frequentes</span>
          <h2 className="section-title">Perguntas frequentes</h2>
          <p className="section-desc">
            Respostas diretas sobre nossos serviços, área de atendimento e processo de contratação.
          </p>
        </div>

        <div className="faq-wrapper">
          {FAQ_ITEMS.map((item) => (
            <details className="faq-item scroll-reveal" key={item.q}>
              <summary>{item.q}</summary>
              <div className="faq-content">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
