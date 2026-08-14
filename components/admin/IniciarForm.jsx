'use client';

import { useActionState } from 'react';
import Icons from '@/components/Icons';

function Result({ state }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div className="admin-form-ok">
        <Icons name="check-circle" size={15} /> {state.message}
      </div>
    );
  }
  return (
    <div className="admin-form-error">
      <Icons name="alert-triangle" size={15} /> {state.error}
    </div>
  );
}

export default function IniciarForm({ action, chamadoId }) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="admin-edit-panel">
      <div className="admin-subsection-title">
        <strong>Iniciar atendimento</strong>
      </div>
      <p className="admin-subsection-hint">
        Ao iniciar, envie as fotos do estado ANTES do serviço (obrigatório). O chamado passa para &quot;em andamento&quot;.
      </p>
      <form action={formAction}>
        <input type="hidden" name="id" value={chamadoId} />
        <div className="admin-form-field full">
          <label>Fotos do antes *</label>
          <input type="file" name="fotos" accept="image/*" multiple required />
        </div>
        <Result state={state} />
        <div className="admin-form-actions">
          <button type="submit" className="admin-save-btn" disabled={pending}>
            <Icons name="play" size={15} /> {pending ? 'Enviando...' : 'Iniciar atendimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
