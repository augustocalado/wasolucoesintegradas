'use client';

import { useActionState } from 'react';
import Icons from '@/components/Icons';

export default function AdicionarFotosForm({ action, chamadoId }) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="admin-edit-panel">
      <div className="admin-subsection-title">
        <strong>Adicionar fotos</strong>
      </div>
      <form action={formAction}>
        <input type="hidden" name="id" value={chamadoId} />
        <div className="admin-form-grid">
          <div className="admin-form-field">
            <label htmlFor="fase">Fase</label>
            <select id="fase" name="fase" defaultValue="antes">
              <option value="antes">Antes</option>
              <option value="depois">Depois</option>
            </select>
          </div>
          <div className="admin-form-field">
            <label>Fotos</label>
            <input type="file" name="fotos" accept="image/*" multiple required />
          </div>
        </div>
        {state?.error && (
          <div className="admin-form-error">
            <Icons name="alert-triangle" size={15} /> {state.error}
          </div>
        )}
        {state?.ok && (
          <div className="admin-form-ok">
            <Icons name="check-circle" size={15} /> {state.message}
          </div>
        )}
        <div className="admin-form-actions">
          <button type="submit" className="admin-save-btn" disabled={pending}>
            <Icons name="plus" size={15} /> {pending ? 'Enviando...' : 'Adicionar fotos'}
          </button>
        </div>
      </form>
    </div>
  );
}
