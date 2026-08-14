import { createAdminClient } from '@/lib/supabase/admin';
import CrudModule from '@/components/admin/CrudModule';
import { createFornecedor, updateFornecedor, deleteFornecedor } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminFornecedores() {
  const { data: fornecedores } = await createAdminClient().from('fornecedores').select('*').order('nome');

  const fields = [
    { name: 'nome', label: 'Nome / Razão social', required: true },
    { name: 'documento', label: 'CPF / CNPJ', placeholder: '00.000.000/0001-00' },
    { name: 'telefone', label: 'Telefone / WhatsApp', type: 'tel', required: true, placeholder: '(11) 99999-9999' },
    { name: 'email', label: 'E-mail', type: 'email', placeholder: 'vendas@fornecedor.com.br' },
    { name: 'endereco', label: 'Endereço', placeholder: 'Rua, número, bairro' },
    { name: 'cidade', label: 'Cidade', required: true, placeholder: 'São Paulo' },
    { name: 'uf', label: 'UF', placeholder: 'SP' },
    { name: 'observacoes', label: 'Observações', type: 'textarea', rows: 2 },
  ];

  const columns = [
    { key: 'nome', label: 'Fornecedor', className: 'admin-cel-cliente' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'E-mail' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'created_at', label: 'Cadastro', format: 'date' },
  ];

  return (
    <CrudModule
      itemLabel="Fornecedor"
      rows={fornecedores ?? []}
      columns={columns}
      fields={fields}
      createAction={createFornecedor}
      updateAction={updateFornecedor}
      deleteAction={deleteFornecedor}
      searchKeys={['nome', 'documento', 'telefone', 'email', 'cidade']}
    />
  );
}
