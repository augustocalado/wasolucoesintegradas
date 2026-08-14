'use client';

import { useState } from 'react';
import Icons from '@/components/Icons';

export default function AddItemForm({ orcamentoId, produtos, action }) {
  const [produtoId, setProdutoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState(0);

  function onProdutoChange(id) {
    setProdutoId(id);
    const p = produtos.find((x) => x.id === id);
    setDescricao(p ? p.nome : '');
    setPreco(p ? Number(p.preco_venda) : 0);
  }

  return (
    <form action={action} className="admin-add-item">
      <input type="hidden" name="orcamento_id" value={orcamentoId} />
      <select value={produtoId} onChange={(e) => onProdutoChange(e.target.value)}>
        <option value="">Linha manual</option>
        {produtos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <input
        type="text"
        name="descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição do item"
        required
      />
      <input
        type="number"
        name="quantidade"
        min="0.01"
        step="0.01"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <input
        type="number"
        name="preco_unitario"
        min="0"
        step="0.01"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <button type="submit" className="admin-save-btn">
        <Icons name="plus" size={15} /> Adicionar
      </button>
    </form>
  );
}
