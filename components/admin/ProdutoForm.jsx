'use client';

import { useActionState, useState } from 'react';
import Icons from '@/components/Icons';

function fmtBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
}

function calcVenda(custo, margem) {
  const m = Number(margem) || 0;
  if (m <= 0) return Number(custo) || 0;
  if (m >= 100) return 0;
  return (Number(custo) || 0) / (1 - m / 100);
}

export default function ProdutoForm({ categorias, fornecedores, initial = null, action, submitLabel, onCancel }) {
  const editing = Boolean(initial);
  const [custo, setCusto] = useState(initial?.preco_custo ?? '');
  const [margem, setMargem] = useState(initial?.margem ?? 30);
  const [state, formAction, pending] = useActionState(action, { ok: true });

  const venda = calcVenda(custo, margem);

  return (
    <form action={formAction} className="admin-record-form">
      {editing && <input type="hidden" name="id" value={initial.id} />}

      <div className="admin-form-grid">
        <div className="admin-form-field full">
          <label htmlFor="f-nome">Nome do produto *</label>
          <input id="f-nome" name="nome" type="text" required placeholder="Ex: Refletor LED 50W" defaultValue={initial?.nome ?? ''} />
        </div>
        <div className="admin-form-field full">
          <label htmlFor="f-descricao">Descrição</label>
          <textarea id="f-descricao" name="descricao" rows={2} defaultValue={initial?.descricao ?? ''}></textarea>
        </div>
        <div className="admin-form-field">
          <label htmlFor="f-categoria">Categoria</label>
          <select id="f-categoria" name="categoria" defaultValue={initial?.categoria ?? 'Outro'}>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-field">
          <label htmlFor="f-unidade">Unidade</label>
          <input id="f-unidade" name="unidade" type="text" placeholder="un, m, cx" defaultValue={initial?.unidade ?? 'un'} />
        </div>
        <div className="admin-form-field">
          <label htmlFor="f-preco_custo">Preço de custo *</label>
          <input
            id="f-preco_custo"
            name="preco_custo"
            type="number"
            min="0"
            step="0.01"
            required
            value={custo}
            onChange={(e) => setCusto(e.target.value)}
          />
        </div>
        <div className="admin-form-field">
          <label htmlFor="f-margem">Margem (%) *</label>
          <input
            id="f-margem"
            name="margem"
            type="number"
            min="0"
            max="90"
            step="0.1"
            required
            value={margem}
            onChange={(e) => setMargem(e.target.value)}
          />
        </div>
        <div className="admin-form-field">
          <label>Preço de venda (automático)</label>
          <div className="admin-price-automatic">{fmtBRL(venda)}</div>
        </div>
        <div className="admin-form-field">
          <label htmlFor="f-fornecedor_id">Fornecedor</label>
          <select id="f-fornecedor_id" name="fornecedor_id" defaultValue={initial?.fornecedor_id ?? ''}>
            <option value="">— Nenhum —</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-field full">
          <label htmlFor="f-observacoes">Observações</label>
          <textarea id="f-observacoes" name="observacoes" rows={2} defaultValue={initial?.observacoes ?? ''}></textarea>
        </div>
      </div>

      {state?.error && (
        <div className="admin-form-error">
          <Icons name="alert-triangle" size={15} /> {state.error}
        </div>
      )}

      <div className="admin-form-actions">
        <button type="submit" className="admin-save-btn" disabled={pending}>
          <Icons name="save" size={15} /> {pending ? 'Salvando...' : (submitLabel ?? (editing ? 'Salvar alterações' : 'Cadastrar'))}
        </button>
        {onCancel && (
          <button type="button" className="admin-cancel-btn" onClick={onCancel}>
            <Icons name="x" size={15} /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
