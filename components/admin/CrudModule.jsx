'use client';

import { useMemo, useState } from 'react';
import Icons from '@/components/Icons';
import RecordForm from './RecordForm';

function formatCell(value, format) {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);
  }
  if (format === 'date') {
    if (!value) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(value));
  }
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

export default function CrudModule({
  itemLabel,
  rows,
  columns,
  fields,
  createAction,
  updateAction,
  deleteAction,
  searchKeys,
  emptyText,
  formComponent,
  formProps,
}) {
  const FormComponent = formComponent ?? RecordForm;
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)));
  }, [rows, query, searchKeys]);

  return (
    <div className="crud-module">
      <div className="admin-topbar">
        <div>
          <h1 className="admin-page-title">{itemLabel}s</h1>
          <p className="admin-page-sub">Cadastro de {itemLabel.toLowerCase()}s do sistema.</p>
        </div>
        <button type="button" className="admin-new-btn" onClick={() => setCreating((v) => !v)}>
          <Icons name="plus" size={16} /> Novo {itemLabel}
        </button>
      </div>

      {searchKeys && searchKeys.length > 0 && (
        <div className="admin-search">
          <Icons name="search" size={16} />
          <input
            type="text"
            placeholder={`Buscar ${itemLabel.toLowerCase()}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}

      {creating && (
        <FormComponent
          {...formProps}
          fields={fields}
          action={createAction}
          submitLabel={`Cadastrar ${itemLabel}`}
          onCancel={() => setCreating(false)}
        />
      )}

      {editing && (
        <FormComponent
          {...formProps}
          fields={fields}
          initial={editing}
          action={updateAction}
          submitLabel="Salvar alterações"
          onCancel={() => setEditing(null)}
        />
      )}

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <p>{query ? 'Nada encontrado para essa busca.' : (emptyText ?? `Nenhum ${itemLabel.toLowerCase()} cadastrado ainda.`)}</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {formatCell(row[col.key], col.format)}
                    </td>
                  ))}
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-edit-btn" onClick={() => setEditing(editing?.id === row.id ? null : row)}>
                        <Icons name="check-square" size={14} /> {editing?.id === row.id ? 'Fechar' : 'Editar'}
                      </button>
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="admin-delete-btn"
                          onClick={(e) => {
                            if (!confirm(`Excluir ${itemLabel.toLowerCase()} "${row[columns[0].key]}"?`)) e.preventDefault();
                          }}
                        >
                          <Icons name="trash2" size={14} /> Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
