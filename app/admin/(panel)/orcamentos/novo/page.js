import { createAdminClient } from '@/lib/supabase/admin';
import OrcamentoForm from '@/components/admin/OrcamentoForm';
import { createOrcamento } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NovoOrcamento() {
  const admin = createAdminClient();
  const [{ data: clientes }, { data: produtos }] = await Promise.all([
    admin.from('clientes').select('id, nome, cidade').order('nome'),
    admin.from('produtos').select('id, nome, preco_venda').order('nome'),
  ]);

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <h1 className="admin-page-title">Novo orçamento</h1>
          <p className="admin-page-sub">Vincule a um cliente e adicione itens do catálogo de produtos.</p>
        </div>
      </header>

      {(!clientes || clientes.length === 0) && (
        <div className="admin-alert">
          Cadastre pelo menos um cliente em <a href="/admin/clientes">Clientes</a> antes de criar um orçamento.
        </div>
      )}

      <OrcamentoForm
        clientes={clientes ?? []}
        produtos={produtos ?? []}
        action={createOrcamento}
        submitLabel="Criar orçamento"
      />
    </div>
  );
}
