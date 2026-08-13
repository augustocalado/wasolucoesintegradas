'use client';

import { useRef, useState } from 'react';
import Icons from '@/components/Icons';
import { buildSolicitacaoMessage, buildWhatsappLink } from '@/lib/whatsapp';

const VALIDATORS = {
  nome: (v) => v.trim().length >= 3,
  empresa: (v) => v.trim().length >= 2,
  telefone: (v) => /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(v.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  cidade: (v) => v.trim().length >= 2,
  servico: (v) => v !== '',
  descricao: (v) => v.trim().length >= 10,
};

const SERVICOS = ['Elétrica', 'Iluminação', 'CFTV', 'Hidráulica', 'Manutenção', 'Instalação', 'Infraestrutura', 'Outro'];

export default function FormSolicitacao() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const formRef = useRef(null);

  function validateField(name) {
    const field = formRef.current.elements[name];
    const group = field ? field.closest('.form-group') : null;
    let value = field?.value ?? '';

    if (field?.type === 'radio') {
      const checked = formRef.current.querySelector(`input[name="${name}"]:checked`);
      value = checked ? checked.value : '';
    }

    const isValid = VALIDATORS[name](value);
    if (group) group.classList.toggle('invalid', !isValid);
    return isValid;
  }

  function getFieldValue(name) {
    const field = formRef.current.elements[name];
    if (field?.type === 'radio') {
      const checked = formRef.current.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : '';
    }
    return field?.value ?? '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const fields = ['nome', 'empresa', 'telefone', 'email', 'cidade', 'servico', 'descricao'];
    const allValid = fields.every(validateField);

    if (!allValid) {
      const firstInvalid = formRef.current.querySelector('.form-group.invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const data = {
      nome: getFieldValue('nome'),
      empresa: getFieldValue('empresa'),
      telefone: getFieldValue('telefone'),
      email: getFieldValue('email'),
      cidade: getFieldValue('cidade'),
      servico: getFieldValue('servico'),
      urgencia: getFieldValue('urgencia'),
      descricao: getFieldValue('descricao'),
    };

    setStatus('saving');

    try {
      const res = await fetch('/api/solicitacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar solicitação');
      }

      setWhatsappUrl(buildWhatsappLink(buildSolicitacaoMessage(data)));
      setStatus('success');
    } catch {
      setStatus('error');
      setError('Não foi possível enviar agora. Tente novamente ou fale direto pelo WhatsApp.');
    }
  }

  if (status === 'success') {
    return (
      <div className="solicitacao-form-wrapper">
        <div id="sucesso-form" className="form-success-card">
          <div className="success-icon-box">
            <Icons name="check-circle" size={38} />
          </div>
          <h3>Solicitação de Atendimento Enviada!</h3>
          <p>
            Recebemos suas informações. Nossa equipe técnica de facilities está analisando seu problema e entrará em
            contato em instantes.
          </p>
          <div className="success-divider">ou se preferir</div>
          <p className="success-sub">
            Acelere o agendamento enviando os detalhes diretamente para o nosso WhatsApp:
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener" className="btn btn-whatsapp-success btn-block">
            <svg className="whatsapp-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }}>
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.37 5.054L2 22l5.105-1.336a9.926 9.926 0 0 0 4.903 1.3c5.507 0 9.99-4.479 9.991-9.988c.001-2.67-1.037-5.18-2.932-7.072c-1.896-1.893-4.407-2.907-7.055-2.908zm5.834 14.18c-.244.688-1.42 1.254-1.956 1.309c-.488.051-.976.241-3.13-.619c-2.756-1.1-4.528-3.902-4.666-4.086c-.137-.184-1.121-1.492-1.121-2.846c0-1.353.708-2.015.96-2.28c.245-.253.541-.318.72-.318c.18 0 .36 0 .515.008c.162.007.38-.063.593.45c.222.534.757 1.849.822 1.981c.066.133.11.288.021.464c-.088.177-.132.288-.265.443c-.132.155-.278.347-.397.464c-.133.13-.272.271-.116.541c.156.269.69 1.14 1.48 1.845c1.018.91 1.874 1.19 2.14 1.325c.265.132.42.11.575-.067c.155-.177.665-.776.843-1.04c.176-.266.353-.222.597-.133c.245.088 1.55.731 1.815.864c.266.133.443.2.509.31c.067.11.067.643-.177 1.331z" />
            </svg>
            Falar com Suporte WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="solicitacao-form-wrapper">
      <form id="form-solicitacao" className="professional-form" onSubmit={handleSubmit} noValidate ref={formRef}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome completo *</label>
            <input type="text" id="nome" name="nome" placeholder="Digite seu nome" onInput={() => validateField('nome')} />
            <span className="error-msg">Por favor, insira seu nome completo.</span>
          </div>
          <div className="form-group">
            <label htmlFor="empresa">Empresa / Loja *</label>
            <input type="text" id="empresa" name="empresa" placeholder="Nome da sua empresa" onInput={() => validateField('empresa')} />
            <span className="error-msg">Por favor, insira o nome da empresa.</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone / WhatsApp *</label>
            <input type="tel" id="telefone" name="telefone" placeholder="(11) 98060-4534" onInput={() => validateField('telefone')} />
            <span className="error-msg">Por favor, insira um telefone válido.</span>
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail corporativo *</label>
            <input type="email" id="email" name="email" placeholder="nome@suaempresa.com.br" onInput={() => validateField('email')} />
            <span className="error-msg">Por favor, insira um e-mail corporativo válido.</span>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cidade">Cidade *</label>
            <input type="text" id="cidade" name="cidade" placeholder="Ex: São Paulo" onInput={() => validateField('cidade')} />
            <span className="error-msg">Por favor, insira a cidade.</span>
          </div>
          <div className="form-group">
            <label htmlFor="servico">Tipo de serviço *</label>
            <select id="servico" name="servico" defaultValue="" onChange={() => validateField('servico')}>
              <option value="" disabled>
                Selecione uma especialidade
              </option>
              {SERVICOS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="error-msg">Selecione uma especialidade.</span>
          </div>
        </div>

        <div className="form-group">
          <label>Urgência do Chamado *</label>
          <div className="urgency-selector">
            <label className="urgency-option option-low">
              <input type="radio" name="urgencia" value="Baixa" defaultChecked onChange={() => validateField('urgencia')} />
              <span>Baixa</span>
            </label>
            <label className="urgency-option option-medium">
              <input type="radio" name="urgencia" value="Média" onChange={() => validateField('urgencia')} />
              <span>Média</span>
            </label>
            <label className="urgency-option option-high">
              <input type="radio" name="urgencia" value="Alta / Urgente" onChange={() => validateField('urgencia')} />
              <span>Urgente / Loja Parada</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição do problema *</label>
          <textarea id="descricao" name="descricao" rows="4" placeholder="Descreva brevemente o problema técnico ou serviço que precisa ser executado na loja..." onInput={() => validateField('descricao')}></textarea>
          <span className="error-msg">Por favor, preencha a descrição do problema.</span>
        </div>

        {status === 'error' && (
          <div className="form-error-banner">
            <Icons name="alert-triangle" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" id="btn-enviar-solicitacao" disabled={status === 'saving'}>
          <Icons name="send" /> {status === 'saving' ? 'ENVIANDO...' : 'SOLICITAR ATENDIMENTO'}
        </button>
      </form>
    </div>
  );
}
