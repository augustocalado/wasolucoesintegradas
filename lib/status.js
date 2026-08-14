export const STATUS_META = {
  novo: { label: 'Novo', className: 'novo' },
  em_andamento: { label: 'Em andamento', className: 'em_andamento' },
  concluido: { label: 'Concluído', className: 'concluido' },
  enviado: { label: 'Orçamento enviado', className: 'enviado' },
  aprovado: { label: 'Aprovado', className: 'aprovado' },
  recusado: { label: 'Recusado', className: 'recusado' },
};

export const TIPO_META = {
  atendimento: { label: 'Atendimento', className: 'tipo-atendimento' },
  suporte: { label: 'Suporte técnico', className: 'tipo-suporte' },
  orcamento: { label: 'Orçamento', className: 'tipo-orcamento' },
};

export function fmtBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

export function fmtDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
