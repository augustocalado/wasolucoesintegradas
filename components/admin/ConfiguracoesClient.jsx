'use client';

import { useActionState, useState } from 'react';
import Icons from '@/components/Icons';
import { ROLES } from '@/lib/roles';

function Alert({ state, onClose }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div className="admin-form-ok">
        <Icons name="check-circle" size={15} /> {state.message}
        {onClose && (
          <button type="button" className="admin-alert-close" onClick={onClose} aria-label="Fechar">
            <Icons name="x" size={13} />
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="admin-form-error">
      <Icons name="alert-triangle" size={15} /> {state.error}
    </div>
  );
}

export default function ConfiguracoesClient({ logoUrl, usuarios, roleLabels, saveLogo, createUser, updateUser, deleteUser }) {
  const [editingId, setEditingId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [logoState, logoAction, logoPending] = useActionState(saveLogo, null);
  const [createState, createAction, createPending] = useActionState(createUser, null);
  const [updateState, updateAction, updatePending] = useActionState(updateUser, null);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteUser, null);

  const editing = usuarios.find((u) => u.id === editingId) || null;

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Configurações do sistema</h1>
          <p className="admin-page-sub">Logo do site, usuários e permissões do painel.</p>
        </div>
      </header>

      <section className="admin-section-card">
        <div className="admin-subsection-title">
          <strong>Logo do site</strong>
        </div>
        <p className="admin-subsection-hint">
          A imagem aparece no cabeçalho e rodapé do site. Recomendado: quadrada, PNG ou SVG, até 2 MB.
        </p>
        <form action={logoAction} className="admin-logo-form">
          <div className="admin-logo-preview">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo atual do site" />
            ) : (
              <div className="admin-logo-preview-empty">
                <Icons name="image" size={22} /> Logo padrão (WA)
              </div>
            )}
          </div>
          <div className="admin-logo-fields">
            <label htmlFor="logo" className="admin-file-label">
              <Icons name="upload" size={15} /> Escolher imagem
            </label>
            <input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden />
            <button type="submit" className="admin-save-btn" disabled={logoPending}>
              <Icons name="save" size={15} /> {logoPending ? 'Enviando...' : 'Salvar logo'}
            </button>
            <Alert state={logoState} onClose={() => null} />
          </div>
        </form>
      </section>

      <section className="admin-section-card">
        <div className="admin-subsection-title">
          <strong>Usuários</strong>
          <button type="button" className="admin-save-btn" onClick={() => setShowCreate((v) => !v)}>
            <Icons name="user-plus" size={15} /> {showCreate ? 'Fechar' : 'Novo usuário'}
          </button>
        </div>

        {showCreate && (
          <div className="admin-edit-panel">
            <form action={createAction}>
              <div className="admin-form-grid">
                <div className="admin-form-field full">
                  <label htmlFor="u-nome">Nome completo *</label>
                  <input id="u-nome" name="nome" type="text" required placeholder="Nome do usuário" />
                </div>
                <div className="admin-form-field">
                  <label htmlFor="u-email">E-mail (login) *</label>
                  <input id="u-email" name="email" type="email" required placeholder="usuario@empresa.com.br" />
                </div>
                <div className="admin-form-field">
                  <label htmlFor="u-senha">Senha *</label>
                  <input id="u-senha" name="senha" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" />
                </div>
                <div className="admin-form-field">
                  <label htmlFor="u-telefone">Telefone</label>
                  <input id="u-telefone" name="telefone" type="text" placeholder="(11) 99999-9999" />
                </div>
                <div className="admin-form-field">
                  <label htmlFor="u-role">Papel *</label>
                  <select id="u-role" name="role" defaultValue="tecnico">
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Alert state={createState} onClose={() => null} />
              <div className="admin-form-actions">
                <button type="submit" className="admin-save-btn" disabled={createPending}>
                  <Icons name="check" size={15} /> {createPending ? 'Criando...' : 'Criar usuário'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="admin-cel-cliente">
                    <strong>{u.nome}</strong>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge role-${u.role}`}>{roleLabels[u.role] ?? u.role}</span>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.ativo ? 'concluido' : 'recusado'}`}>
                      {u.ativo ? 'Ativo' : 'Desativado'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="admin-edit-btn" onClick={() => setEditingId(u.id)}>
                      <Icons name="settings" size={14} /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <section className="admin-section-card admin-edit-panel">
          <div className="admin-subsection-title">
            <strong>Editar usuário</strong>
            <button type="button" className="admin-cancel-btn" onClick={() => setEditingId(null)}>
              <Icons name="x" size={15} /> Fechar
            </button>
          </div>
          <form action={updateAction}>
            <input type="hidden" name="id" value={editing.id} />
            <div className="admin-form-grid">
              <div className="admin-form-field full">
                <label htmlFor="e-nome">Nome completo *</label>
                <input id="e-nome" name="nome" type="text" required defaultValue={editing.nome} />
              </div>
              <div className="admin-form-field">
                <label htmlFor="e-telefone">Telefone</label>
                <input id="e-telefone" name="telefone" type="text" defaultValue={editing.telefone} />
              </div>
              <div className="admin-form-field">
                <label htmlFor="e-role">Papel</label>
                <select id="e-role" name="role" defaultValue={editing.role}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {roleLabels[r]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-field full">
                <label htmlFor="e-senha">Nova senha (deixe em branco para manter)</label>
                <input id="e-senha" name="nova_senha" type="password" minLength={6} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="admin-form-field full admin-check-line">
                <label>
                  <input type="checkbox" name="ativo" defaultChecked={editing.ativo} /> Usuário ativo (pode entrar no sistema)
                </label>
              </div>
            </div>
            <Alert state={updateState} onClose={() => null} />
            <div className="admin-form-actions">
              <button type="submit" className="admin-save-btn" disabled={updatePending}>
                <Icons name="save" size={15} /> {updatePending ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
          <div className="admin-form-actions admin-edit-delete-row">
            <form
              action={deleteAction}
              onSubmit={(e) => {
                if (!window.confirm(`Excluir o usuário "${editing.nome}"? Essa ação não pode ser desfeita.`)) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={editing.id} />
              <button type="submit" className="admin-delete-btn" disabled={deletePending}>
                <Icons name="trash2" size={15} /> Excluir usuário
              </button>
            </form>
            <Alert state={deleteState} onClose={() => null} />
          </div>
        </section>
      )}
    </div>
  );
}
