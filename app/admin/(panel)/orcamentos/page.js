import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateOrcamentoStatus, deleteOrcamento } from './actions';
import Icons from '@/components/Icons';
import ConfirmDelete from '@/components/admin/ConfirmDelete';

export const dynamic = 'force-dynamic';

const STATUS_META = {
  novo: { label: 'Novo', className: 'novo' },
  em_andamento: { label: 'Em andamento', className: 'em_andamento' },
  enviado: { label: 'Enviado', className: 'enviado' },
  aprovado: { label: 'Aprovado', className: 'aprovado' },
  recusado: { label: 'Recusado', className: 'recusado' },
  concluido: { label: 'Concluído', className: 'concluido' },
};

const STATUS_OPTIONS = ['novo', 'em_andamento', 'enviado', 'aprovado', 'recusado', 'concluido'];

function fmtBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

function fmtDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(value));
}

export default async function AdminOrcamentos({ searchParams }) {
  const params = await searchParams;
  const statusFilter = typeof params.status === 'string' ? params.status : 'todos';

  const admin = createAdminClient();

  let query = admin
    .from('orcamentos')
    .select('*, clientes(nome, cidade), orcamento_itens(id, quantidade, preco_unitario)')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'todos') {
    query = query.eq('status', statusFilter);
  }

  const { data: orcamentos, error } = await query;

  const { data: statsData } = await admin.from('orcamentos').select('status').limit(10000);
  const stats = { total: 0, novo: 0, em_andamento: 0, enviado: 0, aprovado: 0, recusado: 0, concluido: 0 };
  (statsData ?? []).forEach((row) => {
    stats.total += 1;
    if (stats[row.status] !== undefined) stats[row.status] += 1;
  });

  const STATUS_FILTERS = [
    { value: 'todos', label: 'Todos' },
    { value: 'novo', label: 'Novos' },
    { value: 'em_andamento', label: 'Em andamento' },
    { value: 'enviado', label: 'Enviados' },
    { value: 'aprovado', label: 'Aprovados' },
    { value: 'recusado', label: 'Recusados' },
    { value: 'concluido', label: 'Concluídos' },
  ];

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Orçamentos</h1>
          <p className="admin-page-sub">Orçamentos vinculados a clientes, compostos por itens do catálogo.</p>
        </div>
        <Link href="/admin/orcamentos/novo" className="admin-new-btn">
          <Icons name="plus" size={16} /> Novo orçamento
        </Link>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value accent">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Abertos</div>
          <div className="stat-value" style={{ color: '#fbbf24' }}>
            {stats.novo + stats.em_andamento}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Enviados</div>
          <div className="stat-value" style={{ color: '#60a5fa' }}>
            {stats.enviado}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Aprovados</div>
          <div className="stat-value" style={{ color: '#34d399' }}>
            {stats.aprovado}
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        {STATUS_FILTERS.map((f) => (
          <a
            key={f.value}
            href={`/admin/orcamentos${f.value === 'todos' ? '' : `?status=${f.value}`}`}
            className={`admin-tab${statusFilter === f.value ? ' active' : ''}`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {error ? (
        <div className="admin-empty">
          <p>Erro ao carregar orçamentos.</p>
        </div>
      ) : !orcamentos || orcamentos.length === 0 ? (
        <div className="admin-empty">
          <p>Nenhum orçamento por aqui ainda.</p>
          <p>Crie o primeiro orçamento vinculado a um cliente.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data</th>
                <th>Validade</th>
                <th>Itens</th>
                <th>Total</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((o) => {
                const total = (o.orcamento_itens ?? []).reduce(
                  (acc, it) => acc + Number(it.quantidade || 0) * Number(it.preco_unitario || 0),
                  0
                );
                const statusMeta = STATUS_META[o.status] ?? { label: o.status, className: 'novo' };
                return (
                  <tr key={o.id}>
                    <td className="admin-cel-cliente" data-label="Cliente">
                      <strong>{o.clientes?.nome ?? 'Cliente removido'}</strong>
                      <small>{o.clientes?.cidade}</small>
                    </td>
                    <td className="admin-meta" data-label="Data">{fmtDate(o.created_at)}</td>
                    <td className="admin-meta" data-label="Validade">{o.prazo}</td>
                    <td data-label="Itens">{(o.orcamento_itens ?? []).length}</td>
                    <td data-label="Total">
                      <strong className="admin-total">{fmtBRL(total)}</strong>
                    </td>
                    <td data-label="Status">
                      <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                    </td>
                    <td data-label="Ações">
                      <div className="admin-row-actions">
                        <Link href={`/admin/orcamentos/${o.id}`} className="admin-edit-btn">
                          <Icons name="file-text" size={14} /> Ver
                        </Link>
                        <form action={updateOrcamentoStatus} className="admin-status-form">
                          <input type="hidden" name="id" value={o.id} />
                          <select name="status" defaultValue={o.status}>
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {STATUS_META[st].label}
                              </option>
                            ))}
                          </select>
                          <button type="submit">OK</button>
                        </form>
                        <ConfirmDelete
                          action={deleteOrcamento}
                          id={o.id}
                          message="Excluir este orçamento?"
                        />
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
