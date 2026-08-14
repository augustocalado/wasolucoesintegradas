import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { STATUS_META, TIPO_META, fmtDate } from '@/lib/status';
import { getUserRole } from '@/lib/roles';
import Icons from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function MinhaArea() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || getUserRole(user) !== 'cliente') return null;

  const email = (user.email ?? '').toLowerCase();
  const admin = createAdminClient();

  const [{ data: chamados }, { data: clientes }] = await Promise.all([
    admin.from('solicitacoes').select('*').ilike('email', email).order('created_at', { ascending: false }),
    admin.from('clientes').select('id, nome').ilike('email', email),
  ]);

  let orcamentos = [];
  if (clientes?.length) {
    const { data: ors } = await admin
      .from('orcamentos')
      .select('*, orcamento_itens(quantidade, preco_unitario)')
      .in(
        'cliente_id',
        clientes.map((c) => c.id)
      )
      .order('created_at', { ascending: false });
    orcamentos = ors ?? [];
  }

  return (
    <div className="portal-body">
      <div className="portal-hero">
        <h1>Minha área</h1>
        <p>Acompanhe seus chamados e orçamentos em um só lugar.</p>
      </div>

      <div className="portal-section">
        <div className="portal-section-head">
          <h2>Meus chamados</h2>
          <Link href="/abrir-chamado" className="btn btn-sm btn-primary">
            <Icons name="plus" size={15} /> Abrir novo chamado
          </Link>
        </div>
        {!chamados || chamados.length === 0 ? (
          <div className="portal-empty">
            <Icons name="clipboard-list" size={26} />
            <p>Você ainda não abriu nenhum chamado.</p>
            <a href="/abrir-chamado" className="btn btn-primary">
              Abrir meu primeiro chamado
            </a>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Tipo</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((s) => {
                  const statusMeta = STATUS_META[s.status] ?? { label: s.status, className: 'novo' };
                  const tipoMeta = TIPO_META[s.tipo] ?? { label: s.tipo, className: 'tipo-atendimento' };
                  return (
                    <tr key={s.id}>
                      <td>
                        <span className="admin-numero">{s.numero}</span>
                      </td>
                      <td>
                        <span className={`admin-badge ${tipoMeta.className}`}>{tipoMeta.label}</span>
                      </td>
                      <td>{s.servico}</td>
                      <td className="admin-meta">{fmtDate(s.created_at)}</td>
                      <td>
                        <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                      </td>
                      <td>
                        <Link href={`/minha-area/chamados/${s.id}`} className="admin-edit-btn">
                          Acompanhar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="portal-section">
        <div className="portal-section-head">
          <h2>Meus orçamentos</h2>
        </div>
        {orcamentos.length === 0 ? (
          <div className="portal-empty">
            <Icons name="file-text" size={26} />
            <p>Nenhum orçamento encontrado para você.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((o) => {
                  const statusMeta = STATUS_META[o.status] ?? { label: o.status, className: 'novo' };
                  const total = (o.orcamento_itens ?? []).reduce(
                    (acc, it) => acc + Number(it.quantidade || 0) * Number(it.preco_unitario || 0),
                    0
                  );
                  return (
                    <tr key={o.id}>
                      <td className="admin-meta">{fmtDate(o.created_at)}</td>
                      <td>{(o.orcamento_itens ?? []).length}</td>
                      <td className="admin-total">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                      </td>
                      <td>
                        <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
