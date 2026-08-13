export const WHATSAPP_NUMBER = '5511980604534';

export const WHATSAPP_FALLBACK_MESSAGE =
  'Olá, vim pelo site da WA Soluções Integradas e gostaria de solicitar um atendimento para minha empresa.';

export function buildWhatsappLink(message = WHATSAPP_FALLBACK_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildSolicitacaoMessage(data) {
  return [
    '*NOVA SOLICITAÇÃO DE ATENDIMENTO - WA SOLUÇÕES INTEGRADAS*',
    '',
    `*Nome:* ${data.nome}`,
    `*Empresa / Ponto Comercial:* ${data.empresa}`,
    `*Telefone / WhatsApp:* ${data.telefone}`,
    `*E-mail:* ${data.email}`,
    `*Cidade:* ${data.cidade}`,
    `*Tipo de serviço:* ${data.servico}`,
    `*Urgência:* ${data.urgencia}`,
    `*Descrição:* ${data.descricao}`,
  ].join('\n');
}
