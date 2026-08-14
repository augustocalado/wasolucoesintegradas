import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import AddItemForm from '@/components/admin/AddItemForm';
import ConfirmDelete from '@/components/admin/ConfirmDelete';
import Icons from '@/components/Icons';
import { updateOrcamentoStatus, deleteOrcamento, addItem, updateItem, deleteItem } from '../actions';

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default async function OrcamentoDetalhe({ params }) {
  const { id } = await params;

  const admin = createAdminClient();
  const { data: orcamento } = await admin
    .from('orcamentos')
    .select('*, clientes(nome, cidade, email, telefone), orcamento_itens(*, produtos(nome))')
    .eq('id', id)
    .single();

  if (!orcamento) notFound();

  const { data: produtos } = await admin.from('produtos').select('id, nome, preco_venda').order('nome');

  const itens = orcamento.orcamento_itens ?? [];
  const total = itens.reduce((acc, it) => acc + Number(it.quantidade || 0) * Number(it.preco_unitario || 0), 0);
  const statusMeta = STATUS_META[orcamento.status] ?? { label: orcamento.status, className: 'novo' };

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <Link href="/admin/orcamentos" className="admin-back-link">
            ← Voltar para orçamentos
          </Link>
          <h1 className="admin-page-title">Orçamento · {orcamento.clientes?.nome ?? 'Cliente removido'}</h1>
          <p className="admin-page-sub">Criado em {fmtDate(orcamento.created_at)}</p>
        </div>
      </header>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="stat-label">Cliente</div>
          <div className="stat-value" style={{ fontSize: '1.3rem' }}>
            {orcamento.clientes?.nome ?? 'Cliente removido'}
          </div>
          {orcamento.clientes?.cidade && (
            <div className="stat-sub">{orcamento.clientes.cidade}</div>
          )}
          {(orcamento.clientes?.telefone || orcamento.clientes?.email) && (
            <div className="stat-sub">
              {orcamento.clientes?.telefone} · {orcamento.clientes?.email}
            </div>
          )}
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Status</div>
          <div style={{ marginBottom: 12 }}>
            <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
          </div>
          <form action={updateOrcamentoStatus} className="admin-status-form">
            <input type="hidden" name="id" value={orcamento.id} />
            <select name="status" defaultValue={orcamento.status}>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {STATUS_META[st].label}
                </option>
              ))}
            </select>
            <button type="submit">Atualizar</button>
          </form>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Validade</div>
          <div className="stat-value" style={{ fontSize: '1.5rem' }}>
            {orcamento.prazo}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="stat-label">Total do orçamento</div>
          <div className="stat-value accent" style={{ fontSize: '1.7rem' }}>
            {fmtBRL(total)}
          </div>
          <div className="stat-sub">{itens.length} itens</div>
        </div>
      </div>

      {orcamento.observacoes && (
        <div className="admin-card">
          <strong>Observações</strong>
          <p>{orcamento.observacoes}</p>
        </div>
      )}

      <div className="admin-subsection-title">
        <strong>Itens do orçamento</strong>
      </div>

      {itens.length === 0 ? (
        <div className="admin-empty">
          <p>Este orçamento ainda não tem itens. Adicione abaixo.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor unit.</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((it) => (
                <tr key={it.id}>
                  <td className="admin-cel-cliente">
                    <strong>{it.descricao}</strong>
                    <small>{it.produtos?.nome ? `Catálogo: ${it.produtos.nome}` : 'Linha manual'}</small>
                  </td>
                  <td>
                    <form action={updateItem} className="admin-inline-edit">
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="orcamento_id" value={orcamento.id} />
                      <input
                        type="number"
                        name="quantidade"
                        min="0.01"
                        step="0.01"
                        defaultValue={it.quantidade}
                        className="admin-inline-input narrow"
                      />
                    </form>
                  </td>
                  <td>
                    <form action={updateItem} className="admin-inline-edit">
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="orcamento_id" value={orcamento.id} />
                      <input
                        type="number"
                        name="preco_unitario"
                        min="0"
                        step="0.01"
                        defaultValue={it.preco_unitario}
                        className="admin-inline-input narrow"
                      />
                      <button type="submit" className="admin-mini-save" title="Salvar">
                        <Icons name="save" size={14} />
                      </button>
                    </form>
                  </td>
                  <td>
                    <strong className="admin-total">
                      {fmtBRL(Number(it.quantidade || 0) * Number(it.preco_unitario || 0))}
                    </strong>
                  </td>
                  <td>
                    <ConfirmDelete
                      action={deleteItem}
                      id={it.id}
                      hidden={[{ name: 'orcamento_id', value: orcamento.id }]}
                      message="Remover este item?"
                    >
                      <Icons name="trash2" size={14} />
                    </ConfirmDelete>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right' }}>
                  <strong>Total:</strong>
                </td>
                <td colSpan="2">
                  <strong className="admin-total">{fmtBRL(total)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="admin-subsection-title">
        <strong>Adicionar item</strong>
      </div>
      <AddItemForm orcamentoId={orcamento.id} produtos={produtos ?? []} action={addItem} />

      <div style={{ marginTop: 40 }}>
        <ConfirmDelete
          action={deleteOrcamento}
          id={orcamento.id}
          message="Excluir este orçamento permanentemente?"
        >
          <Icons name="trash2" size={14} /> Excluir orçamento
        </ConfirmDelete>
      </div>
    </div>
  );
}
