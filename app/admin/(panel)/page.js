import { createAdminClient } from '@/lib/supabase/admin';
import { updateStatus, deleteRequest } from './actions';
import Icons from '@/components/Icons';

export const dynamic = 'force-dynamic';

const STATUS_META = {
  novo: { label: 'Novo', className: 'novo' },
  em_andamento: { label: 'Em andamento', className: 'em_andamento' },
  concluido: { label: 'Concluído', className: 'concluido' },
  enviado: { label: 'Orçamento enviado', className: 'enviado' },
  aprovado: { label: 'Aprovado', className: 'aprovado' },
  recusado: { label: 'Recusado', className: 'recusado' },
};

const TIPO_META = {
  atendimento: { label: 'Atendimento', className: 'tipo-atendimento' },
  suporte: { label: 'Suporte técnico', className: 'tipo-suporte' },
  orcamento: { label: 'Orçamento', className: 'tipo-orcamento' },
};

const STATUS_BY_TIPO = {
  atendimento: ['novo', 'em_andamento', 'concluido'],
  suporte: ['novo', 'em_andamento', 'concluido'],
  orcamento: ['novo', 'em_andamento', 'enviado', 'aprovado', 'recusado'],
};

const STATUS_FILTERS = [
  { value: 'todos', label: 'Todos' },
  { value: 'novo', label: 'Novos' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluídos' },
  { value: 'enviado', label: 'Orçamentos enviados' },
  { value: 'aprovado', label: 'Aprovados' },
  { value: 'recusado', label: 'Recusados' },
];

const TIPO_FILTERS = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'atendimento', label: 'Atendimento' },
  { value: 'suporte', label: 'Suporte técnico' },
  { value: 'orcamento', label: 'Orçamento' },
];

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default async function AdminChamados({ searchParams }) {
  const params = await searchParams;
  const statusFilter = typeof params.status === 'string' ? params.status : 'todos';
  const tipoFilter = typeof params.tipo === 'string' ? params.tipo : 'todos';

  const admin = createAdminClient();

  let query = admin.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (statusFilter !== 'todos') {
    query = query.eq('status', statusFilter);
  }
  if (tipoFilter !== 'todos') {
    query = query.eq('tipo', tipoFilter);
  }

  const { data: solicitacoes, error } = await query;

  const { data: statsData } = await admin.from('solicitacoes').select('status, tipo').limit(10000);

  const stats = { total: 0, novo: 0, em_andamento: 0, concluido: 0, enviado: 0, aprovado: 0, recusado: 0, atendimento: 0, suporte: 0, orcamento: 0 };
  (statsData ?? []).forEach((row) => {
    stats.total += 1;
    if (stats[row.status] !== undefined) stats[row.status] += 1;
    if (stats[row.tipo] !== undefined) stats[row.tipo] += 1;
  });

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Chamados</h1>
          <p className="admin-page-sub">Solicitações recebidas pelo site: atendimentos, suporte técnico e orçamentos.</p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-label">Total de chamados</div>
          <div className="stat-value accent">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Atendimentos</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.atendimento}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Suporte técnico</div>
          <div className="stat-value" style={{ color: '#c084fc' }}>{stats.suporte}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Orçamentos</div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>{stats.orcamento}</div>
        </div>
      </div>

      <div className="admin-tabs admin-tabs-secondary">
        {TIPO_FILTERS.map((filter) => (
          <a
            key={filter.value}
            href={`/admin${filter.value === 'todos' ? '' : `?tipo=${filter.value}`}`}
            className={`admin-tab${tipoFilter === filter.value ? ' active' : ''}`}
          >
            {filter.label}
          </a>
        ))}
      </div>

      <div className="admin-tabs">
        {STATUS_FILTERS.map((filter) => (
          <a
            key={filter.value}
            href={`/admin${filter.value === 'todos' ? '' : `?status=${filter.value}`}`}
            className={`admin-tab${statusFilter === filter.value ? ' active' : ''}`}
          >
            {filter.label}
          </a>
        ))}
      </div>

      {error ? (
        <div className="admin-empty">
          <p>Erro ao carregar chamados. Verifique a configuração do banco.</p>
        </div>
      ) : !solicitacoes || solicitacoes.length === 0 ? (
        <div className="admin-empty">
          <p>Nenhum chamado {tipoFilter !== 'todos' ? `de "${TIPO_META[tipoFilter]?.label}"` : ''} {statusFilter !== 'todos' ? `com status "${STATUS_META[statusFilter]?.label}"` : ''} por aqui ainda.</p>
          <p>Os chamados enviados pelo formulário do site aparecerão aqui.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Serviço / Urgência</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((s) => {
                const statusMeta = STATUS_META[s.status] ?? { label: s.status, className: 'novo' };
                const tipoMeta = TIPO_META[s.tipo] ?? { label: s.tipo, className: 'tipo-atendimento' };
                const statusOptions = STATUS_BY_TIPO[s.tipo] ?? STATUS_BY_TIPO.atendimento;
                return (
                  <tr key={s.id}>
                    <td>
                      <span className="admin-numero">{s.numero}</span>
                    </td>
                    <td className="admin-cel-cliente">
                      <strong>{s.nome}</strong>
                      <small>{s.empresa}</small>
                      <small>
                        {s.telefone} · {s.email}
                      </small>
                      <small>{s.cidade}</small>
                    </td>
                    <td>
                      <span className={`admin-badge ${tipoMeta.className}`}>{tipoMeta.label}</span>
                    </td>
                    <td>
                      {s.servico}
                      {s.urgencia && s.urgencia !== 'Baixa' && (
                        <div className="admin-badge urgencia" style={{ marginTop: 6 }}>
                          {s.urgencia}
                        </div>
                      )}
                    </td>
                    <td className="admin-cel-desc">
                      <p>{s.descricao}</p>
                    </td>
                    <td className="admin-meta">{formatDate(s.created_at)}</td>
                    <td>
                      <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                    </td>
                    <td>
                      <form action={updateStatus} className="admin-status-form">
                        <input type="hidden" name="id" value={s.id} />
                        <select name="status" defaultValue={s.status}>
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>
                              {STATUS_META[st].label}
                            </option>
                          ))}
                        </select>
                        <button type="submit">Atualizar</button>
                      </form>
                      <form action={deleteRequest} style={{ marginTop: 8 }}>
                        <input type="hidden" name="id" value={s.id} />
                        <button type="submit" className="admin-delete-btn">
                          <Icons name="trash2" size={14} /> Excluir
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
