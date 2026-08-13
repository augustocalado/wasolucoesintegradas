import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateStatus, deleteRequest } from './actions';
import AdminLogout from '@/components/AdminLogout';
import Icons from '@/components/Icons';

export const dynamic = 'force-dynamic';

const STATUS_META = {
  novo: { label: 'Novo', className: 'novo' },
  em_andamento: { label: 'Em andamento', className: 'em_andamento' },
  concluido: { label: 'Concluído', className: 'concluido' },
};

const FILTERS = [
  { value: 'todos', label: 'Todos' },
  { value: 'novo', label: 'Novos' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido', label: 'Concluídos' },
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

export default async function AdminDashboard({ searchParams }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const params = await searchParams;
  const statusFilter = typeof params.status === 'string' ? params.status : 'todos';

  const admin = createAdminClient();

  let query = admin.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (statusFilter !== 'todos') {
    query = query.eq('status', statusFilter);
  }

  const { data: solicitacoes, error } = await query;

  const { data: statsData } = await admin
    .from('solicitacoes')
    .select('status')
    .limit(10000);

  const stats = { total: 0, novo: 0, em_andamento: 0, concluido: 0 };
  (statsData ?? []).forEach((row) => {
    stats.total += 1;
    if (stats[row.status] !== undefined) stats[row.status] += 1;
  });

  return (
    <div className="admin-body">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-header-title">
            <svg className="logo-icon" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="url(#admin-grad2)" />
              <path d="M25 35 L40 70 L50 48 L60 70 L75 35" stroke="#00f0ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 55 L58 55" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
              <defs>
                <linearGradient id="admin-grad2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0a1128" />
                  <stop offset="1" stopColor="#001f54" />
                </linearGradient>
              </defs>
            </svg>
            <span>
              WA <span>| Painel de Solicitações</span>
            </span>
          </div>
          <div className="admin-header-actions">
            <a href="/" className="admin-view-site" target="_blank" rel="noopener">
              <Icons name="globe" size={16} /> Ver site
            </a>
            <AdminLogout />
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="stat-label">Total de solicitações</div>
            <div className="stat-value accent">{stats.total}</div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-label">Novas</div>
            <div className="stat-value" style={{ color: '#60a5fa' }}>
              {stats.novo}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-label">Em andamento</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>
              {stats.em_andamento}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="stat-label">Concluídas</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              {stats.concluido}
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          {FILTERS.map((filter) => (
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
            <p>Erro ao carregar solicitações. Verifique a configuração do banco.</p>
          </div>
        ) : !solicitacoes || solicitacoes.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhuma solicitação {statusFilter !== 'todos' ? `com status "${STATUS_META[statusFilter]?.label}"` : ''} por aqui ainda.</p>
            <p>As solicitações enviadas pelo formulário do site aparecerão aqui.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
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
                  return (
                    <tr key={s.id}>
                      <td className="admin-cel-cliente">
                        <strong>{s.nome}</strong>
                        <small>{s.empresa}</small>
                        <small>
                          {s.telefone} · {s.email}
                        </small>
                        <small>{s.cidade}</small>
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
                            <option value="novo">Novo</option>
                            <option value="em_andamento">Em andamento</option>
                            <option value="concluido">Concluído</option>
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

        <p className="admin-data">Conectado como: {user.email}</p>
      </main>
    </div>
  );
}
