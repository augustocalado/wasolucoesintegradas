import Icons from '@/components/Icons';
import FormSolicitacao from '@/components/FormSolicitacao';

export default function Solicitacao() {
  return (
    <section className="solicitacao-section" id="solicitacao">
      <div className="container">
        <div className="solicitacao-grid">
          <div className="solicitacao-info">
            <span className="section-tag">Contato Oficial</span>
            <h2 className="section-title">Solicite um atendimento</h2>
            <p className="sol-intro">
              Preencha o formulário profissional com os dados da sua empresa. Retornaremos prontamente via telefone,
              e-mail ou WhatsApp para prosseguir com o orçamento e agendamento.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <Icons name="message-square" className="contact-icon" size={24} />
                <div>
                  <h5>WhatsApp Principal</h5>
                  <p>
                    <a href="https://wa.me/5511980604534" target="_blank" rel="noopener">
                      +55 11 98060-4534
                    </a>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <Icons name="globe" className="contact-icon" size={24} />
                <div>
                  <h5>Website Oficial</h5>
                  <p>
                    <a href="https://www.wasolucoesintegradas.com.br/" className="site-link">
                      www.wasolucoesintegradas.com.br
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="no-residential-warning">
              <Icons name="alert-triangle" />
              <p>
                <strong>Atenção:</strong> Não realizamos pequenos reparos residenciais (marido de aluguel/eletricista
                residencial). Nosso atendimento é focado exclusivamente em varejo e instalações corporativas B2B.
              </p>
            </div>
          </div>

          <FormSolicitacao />
        </div>
      </div>
    </section>
  );
}
