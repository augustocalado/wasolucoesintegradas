'use client';

import { useActionState } from 'react';
import Icons from '@/components/Icons';
import SignaturePad from '@/components/admin/SignaturePad';

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

export default function FinalizarForm({ action, chamadoId }) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <div className="admin-edit-panel">
      <div className="admin-subsection-title">
        <strong>Finalizar atendimento</strong>
      </div>
      <p className="admin-subsection-hint">
        Ao finalizar, envie as fotos do estado DEPOIS do serviço e colete a assinatura de quem acompanhou o trabalho.
      </p>
      <form action={formAction}>
        <input type="hidden" name="id" value={chamadoId} />
        <div className="admin-form-grid">
          <div className="admin-form-field full">
            <label>Fotos do depois *</label>
            <input type="file" name="fotos" accept="image/*" multiple required />
          </div>
          <div className="admin-form-field full">
            <label htmlFor="assinatura-nome">Nome de quem acompanhou e assinou *</label>
            <input
              id="assinatura-nome"
              name="assinatura_nome"
              type="text"
              required
              placeholder="Ex.: João, gerente da loja"
            />
          </div>
          <div className="admin-form-field full">
            <SignaturePad />
          </div>
        </div>
        <Result state={state} />
        <div className="admin-form-actions">
          <button type="submit" className="admin-save-btn" disabled={pending}>
            <Icons name="check-circle" size={15} /> {pending ? 'Finalizando...' : 'Finalizar atendimento'}
          </button>
        </div>
      </form>
    </div>
  );
}
