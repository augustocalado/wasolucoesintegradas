'use client';

import { useMemo, useState } from 'react';
import Icons from '@/components/Icons';

function fmtBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

export default function OrcamentoForm({ clientes, produtos, action, submitLabel = 'Criar orçamento' }) {
  const [items, setItems] = useState([]);

  function addRow() {
    setItems((prev) => [...prev, { produto_id: '', descricao: '', quantidade: 1, preco_unitario: 0 }]);
  }

  function updateRow(idx, patch) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function removeRow(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function onProdutoChange(idx, produtoId) {
    const p = produtos.find((x) => x.id === produtoId);
    updateRow(idx, {
      produto_id: produtoId,
      descricao: p ? p.nome : '',
      preco_unitario: p ? Number(p.preco_venda) : 0,
    });
  }

  const total = useMemo(() => items.reduce((acc, it) => acc + (Number(it.quantidade) || 0) * (Number(it.preco_unitario) || 0), 0), [items]);

  return (
    <form action={action} className="admin-record-form">
      <div className="admin-form-grid">
        <div className="admin-form-field full">
          <label htmlFor="cliente_id">Cliente *</label>
          <select id="cliente_id" name="cliente_id" required>
            <option value="" disabled>
              Selecione o cliente
            </option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — {c.cidade}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="novo">
            <option value="novo">Novo</option>
            <option value="em_andamento">Em andamento</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        <div className="admin-form-field">
          <label htmlFor="prazo">Validade do orçamento</label>
          <input id="prazo" name="prazo" type="text" defaultValue="7 dias" placeholder="Ex: 7 dias" />
        </div>
        <div className="admin-form-field full">
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" name="observacoes" rows={2} placeholder="Condições, escopo do serviço, observações..."></textarea>
        </div>
      </div>

      <input type="hidden" name="itens" value={JSON.stringify(items)} />

      <div className="admin-subsection-title">
        <strong>Itens do orçamento</strong>
        <button type="button" className="admin-new-btn small" onClick={addRow}>
          <Icons name="plus" size={15} /> Adicionar item
        </button>
      </div>

      {items.length === 0 ? (
        <p className="admin-hint">Nenhum item adicionado. Você pode adicionar depois no detalhe do orçamento.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor unit.</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      value={it.produto_id}
                      onChange={(e) => onProdutoChange(idx, e.target.value)}
                      className="admin-inline-select"
                    >
                      <option value="">Linha manual</option>
                      {produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="admin-inline-input"
                      value={it.descricao}
                      onChange={(e) => updateRow(idx, { descricao: e.target.value })}
                      placeholder="Descrição do item"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="admin-inline-input narrow"
                      value={it.quantidade}
                      onChange={(e) => updateRow(idx, { quantidade: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="admin-inline-input narrow"
                      value={it.preco_unitario}
                      onChange={(e) => updateRow(idx, { preco_unitario: e.target.value })}
                    />
                  </td>
                  <td>{fmtBRL(Number(it.quantidade || 0) * Number(it.preco_unitario || 0))}</td>
                  <td>
                    <button type="button" className="admin-delete-btn" onClick={() => removeRow(idx)}>
                      <Icons name="trash2" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: 'right' }}>
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

      <div className="admin-form-actions">
        <button type="submit" className="admin-save-btn">
          <Icons name="save" size={15} /> {submitLabel}
        </button>
        <a href="/admin/orcamentos" className="admin-cancel-btn-link">
          Cancelar
        </a>
      </div>
    </form>
  );
}
