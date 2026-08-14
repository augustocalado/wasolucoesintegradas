import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/roles';
import { STATUS_META, TIPO_META, fmtDate } from '@/lib/status';
import Icons from '@/components/Icons';
import ConfirmDelete from '@/components/admin/ConfirmDelete';
import { updateStatus, deleteRequest } from './actions';

export const dynamic = 'force-dynamic';

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

export default async function AdminChamados({ searchParams }) {
  const params = await searchParams;
  const statusFilter = typeof params.status === 'string' ? params.status : 'todos';
  const tipoFilter = typeof params.tipo === 'string' ? params.tipo : 'todos';

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const role = getUserRole(user);
  const isAdmin = role === 'admin';
  const isTecnico = role === 'tecnico';

  const admin = createAdminClient();

  let tecnicosById = {};
  if (isAdmin) {
    const { data: authData } = await admin.auth.admin.listUsers();
    (authData?.users ?? []).forEach((u) => {
      if ((u.user_metadata?.role || 'admin') === 'tecnico') {
        tecnicosById[u.id] = u.user_metadata?.full_name || u.email;
      }
    });
  }

  let query = admin.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (isTecnico) query = query.eq('tecnico_id', user.id);
  if (statusFilter !== 'todos') query = query.eq('status', statusFilter);
  if (tipoFilter !== 'todos') query = query.eq('tipo', tipoFilter);

  const { data: solicitacoes, error } = await query;

  let statsQuery = admin.from('solicitacoes').select('status, tipo').limit(10000);
  if (isTecnico) statsQuery = statsQuery.eq('tecnico_id', user.id);
  const { data: statsData } = await statsQuery;

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
          <p className="admin-page-sub">
            {isTecnico ? 'Chamados atribuídos a você.' : 'Solicitações recebidas pelo site: atendimentos, suporte técnico e orçamentos.'}
          </p>
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
          <p>
            Nenhum chamado{' '}
            {tipoFilter !== 'todos' ? `de "${TIPO_META[tipoFilter]?.label}"` : ''}{' '}
            {statusFilter !== 'todos' ? `com status "${STATUS_META[statusFilter]?.label}"` : ''} por aqui ainda.
          </p>
          <p>{isTecnico ? 'Aguarde o administrador atribuir chamados a você.' : 'Os chamados enviados pelo formulário do site aparecerão aqui.'}</p>
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
                {isAdmin && <th>Técnico</th>}
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
                      <Link href={`/admin/chamados/${s.id}`} className="admin-numero admin-numero-link">
                        {s.numero}
                      </Link>
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
                    {isAdmin && (
                      <td>{s.tecnico_id ? tecnicosById[s.tecnico_id] ?? 'Técnico' : <span className="admin-muted">—</span>}</td>
                    )}
                    <td className="admin-meta">{fmtDate(s.created_at)}</td>
                    <td>
                      <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/chamados/${s.id}`} className="admin-edit-btn">
                          <Icons name="eye" size={14} /> Ver
                        </Link>
                        <form action={updateStatus} className="admin-status-form">
                          <input type="hidden" name="id" value={s.id} />
                          <select name="status" defaultValue={s.status}>
                            {statusOptions.map((st) => (
                              <option key={st} value={st}>
                                {STATUS_META[st].label}
                              </option>
                            ))}
                          </select>
                          <button type="submit">OK</button>
                        </form>
                        {isAdmin && (
                          <ConfirmDelete
                            action={deleteRequest}
                            id={s.id}
                            message={`Excluir o chamado ${s.numero}?`}
                          >
                            <Icons name="trash2" size={14} />
                          </ConfirmDelete>
                        )}
                      </div>
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
