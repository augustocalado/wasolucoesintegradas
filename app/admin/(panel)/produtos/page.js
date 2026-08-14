import { createAdminClient } from '@/lib/supabase/admin';
import CrudModule from '@/components/admin/CrudModule';
import ProdutoForm from '@/components/admin/ProdutoForm';
import { createProduto, updateProduto, deleteProduto } from './actions';

export const dynamic = 'force-dynamic';

const CATEGORIAS = [
  'Elétrica',
  'Iluminação',
  'CFTV',
  'Hidráulica',
  'Climatização',
  'Manutenção',
  'Ferramentas',
  'Material de consumo',
  'Outro',
];

export default async function AdminProdutos() {
  const admin = createAdminClient();
  const [{ data: produtos }, { data: fornecedores }] = await Promise.all([
    admin.from('produtos').select('*, fornecedores(nome)').order('nome'),
    admin.from('fornecedores').select('id, nome').order('nome'),
  ]);

  const rows = (produtos ?? []).map((p) => ({
    ...p,
    fornecedor_nome: p.fornecedores?.nome ?? '-',
    margem_pct: `${p.margem}%`,
  }));

  const columns = [
    { key: 'nome', label: 'Produto', className: 'admin-cel-cliente' },
    { key: 'categoria', label: 'Categoria' },
    { key: 'preco_custo', label: 'Custo', format: 'currency' },
    { key: 'margem_pct', label: 'Margem' },
    { key: 'preco_venda', label: 'Venda', format: 'currency' },
    { key: 'fornecedor_nome', label: 'Fornecedor' },
  ];

  return (
    <CrudModule
      itemLabel="Produto"
      rows={rows}
      columns={columns}
      fields={[]}
      formComponent={ProdutoForm}
      formProps={{ categorias: CATEGORIAS, fornecedores: fornecedores ?? [] }}
      createAction={createProduto}
      updateAction={updateProduto}
      deleteAction={deleteProduto}
      searchKeys={['nome', 'categoria', 'fornecedor_nome']}
    />
  );
}
