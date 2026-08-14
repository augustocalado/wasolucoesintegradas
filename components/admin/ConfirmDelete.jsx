'use client';

import Icons from '@/components/Icons';

export default function ConfirmDelete({
  action,
  id,
  hidden = [],
  message,
  buttonClass = 'admin-delete-btn',
  children,
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message ?? 'Tem certeza que deseja excluir este registro?')) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {hidden.map((h) => (
        <input key={h.name} type="hidden" name={h.name} value={h.value} />
      ))}
      <button type="submit" className={buttonClass}>
        {children ?? (
          <>
            <Icons name="trash2" size={14} /> Excluir
          </>
        )}
      </button>
    </form>
  );
}
