'use client';

import { useActionState } from 'react';
import Icons from '@/components/Icons';

export default function RecordForm({ fields, initial = null, action, submitLabel, onCancel }) {
  const editing = Boolean(initial);
  const [state, formAction, pending] = useActionState(action, { ok: true });

  return (
    <form action={formAction} className="admin-record-form">
      {editing && <input type="hidden" name="id" value={initial.id} />}
      <div className="admin-form-grid">
        {fields.map((field) => (
          <div key={field.name} className={`admin-form-field${field.full ? ' full' : ''}`}>
            <label htmlFor={`f-${field.name}`}>{field.label}{field.required ? ' *' : ''}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={`f-${field.name}`}
                name={field.name}
                rows={field.rows ?? 3}
                defaultValue={initial?.[field.name] ?? field.default ?? ''}
                required={field.required}
                placeholder={field.placeholder ?? ''}
              ></textarea>
            ) : field.type === 'select' ? (
              <select id={`f-${field.name}`} name={field.name} defaultValue={initial?.[field.name] ?? field.default ?? ''} required={field.required}>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`f-${field.name}`}
                type={field.type ?? 'text'}
                name={field.name}
                defaultValue={initial?.[field.name] ?? field.default ?? ''}
                required={field.required}
                placeholder={field.placeholder ?? ''}
                step={field.type === 'number' ? '0.01' : undefined}
              />
            )}
          </div>
        ))}
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
