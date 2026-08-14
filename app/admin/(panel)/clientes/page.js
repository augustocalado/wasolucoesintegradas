import { createAdminClient } from '@/lib/supabase/admin';
import CrudModule from '@/components/admin/CrudModule';
import { createCliente, updateCliente, deleteCliente } from './actions';

export const dynamic = 'force-dynamic';

export default async function AdminClientes() {
  const { data: clientes } = await createAdminClient().from('clientes').select('*').order('nome');

  const fields = [
    { name: 'nome', label: 'Nome / Razão social', required: true },
    { name: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0001-00' },
    { name: 'documento', label: 'CPF', placeholder: '000.000.000-00' },
    { name: 'telefone', label: 'Telefone / WhatsApp', type: 'tel', required: true, placeholder: '(11) 99999-9999' },
    { name: 'email', label: 'E-mail', type: 'email', placeholder: 'contato@empresa.com.br' },
    { name: 'endereco', label: 'Endereço', placeholder: 'Rua, número, bairro' },
    { name: 'cidade', label: 'Cidade', required: true, placeholder: 'São Paulo' },
    { name: 'uf', label: 'UF', placeholder: 'SP' },
    { name: 'observacoes', label: 'Observações', type: 'textarea', rows: 2 },
  ];

  const columns = [
    { key: 'nome', label: 'Cliente', className: 'admin-cel-cliente' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'telefone', label: 'Telefone' },
    { key: 'email', label: 'E-mail' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'created_at', label: 'Cadastro', format: 'date' },
  ];

  return (
    <CrudModule
      itemLabel="Cliente"
      rows={clientes ?? []}
      columns={columns}
      fields={fields}
      createAction={createCliente}
      updateAction={updateCliente}
      deleteAction={deleteCliente}
      searchKeys={['nome', 'cnpj', 'documento', 'telefone', 'email', 'cidade']}
    />
  );
}
