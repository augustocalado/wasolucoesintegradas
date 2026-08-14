import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/roles';
import { STATUS_META, TIPO_META, fmtDate } from '@/lib/status';
import Icons from '@/components/Icons';
import ConfirmDelete from '@/components/admin/ConfirmDelete';
import IniciarForm from '@/components/admin/IniciarForm';
import FinalizarForm from '@/components/admin/FinalizarForm';
import AdicionarFotosForm from '@/components/admin/AdicionarFotosForm';
import { deleteRequest } from '../../actions';
import { iniciarAtendimento, finalizarAtendimento, adicionarFotos, atribuirTecnico } from './actions';

export const dynamic = 'force-dynamic';

export default async function ChamadoDetalhe({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const role = getUserRole(user);

  const admin = createAdminClient();
  const { data: s } = await admin.from('solicitacoes').select('*').eq('id', id).maybeSingle();
  if (!s) notFound();

  if (role !== 'admin') {
    if (role === 'cliente' || (role === 'tecnico' && s.tecnico_id !== user.id)) {
      redirect('/admin');
    }
  }

  const isAdmin = role === 'admin';
  const isTecnico = role === 'tecnico';

  let tecnicos = [];
  if (isAdmin) {
    const { data: authData } = await admin.auth.admin.listUsers();
    tecnicos = (authData?.users ?? [])
      .filter((u) => !u.banned && (u.user_metadata?.role || 'admin') === 'tecnico')
      .map((u) => ({ id: u.id, nome: u.user_metadata?.full_name || u.email }));
  }

  const tecnicoNome = s.tecnico_id
    ? isAdmin
      ? tecnicos.find((t) => t.id === s.tecnico_id)?.nome || 'Técnico'
      : user.user_metadata?.full_name || user.email
    : null;

  const fotosAntes = Array.isArray(s.fotos_antes) ? s.fotos_antes : [];
  const fotosDepois = Array.isArray(s.fotos_depois) ? s.fotos_depois : [];
  const statusMeta = STATUS_META[s.status] ?? { label: s.status, className: 'novo' };
  const tipoMeta = TIPO_META[s.tipo] ?? { label: s.tipo, className: 'tipo-atendimento' };

  return (
    <div className="admin-body">
      <header className="admin-topbar">
        <div>
          <Link href="/admin" className="admin-back-link">
            ← Voltar para chamados
          </Link>
          <h1 className="admin-page-title">
            Chamado <span className="admin-numero">{s.numero}</span>
          </h1>
          <p className="admin-page-sub">
            Aberto em {fmtDate(s.created_at)} · {s.nome}
            {s.empresa ? ` · ${s.empresa}` : ''} · {s.cidade}
          </p>
        </div>
        <div className="admin-topbar-actions">
          <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
          <span className={`admin-badge ${tipoMeta.className}`}>{tipoMeta.label}</span>
        </div>
      </header>

      <div className="admin-chamado-layout">
        <div className="admin-chamado-main">
          <section className="admin-section-card">
            <div className="admin-subsection-title">
              <strong>Dados do chamado</strong>
            </div>
            <div className="admin-chamado-grid">
              <div>
                <span className="admin-chamado-label">Cliente</span>
                <strong>{s.nome}</strong>
              </div>
              <div>
                <span className="admin-chamado-label">Telefone</span>
                <strong>{s.telefone}</strong>
              </div>
              <div>
                <span className="admin-chamado-label">E-mail</span>
                <strong>{s.email}</strong>
              </div>
              <div>
                <span className="admin-chamado-label">Cidade</span>
                <strong>{s.cidade}</strong>
              </div>
              <div>
                <span className="admin-chamado-label">Serviço</span>
                <strong>{s.servico}</strong>
              </div>
              <div>
                <span className="admin-chamado-label">Urgência</span>
                <strong>{s.urgencia}</strong>
              </div>
              {tecnicoNome && (
                <div>
                  <span className="admin-chamado-label">Técnico responsável</span>
                  <strong>{tecnicoNome}</strong>
                </div>
              )}
            </div>
            <div className="admin-chamado-desc">
              <span className="admin-chamado-label">Descrição</span>
              <p>{s.descricao}</p>
            </div>
          </section>

          <section className="admin-section-card">
            <div className="admin-subsection-title">
              <strong>Fotos do antes ({fotosAntes.length})</strong>
            </div>
            {fotosAntes.length === 0 ? (
              <p className="admin-empty-small">Nenhuma foto registrada.</p>
            ) : (
              <div className="admin-photo-grid">
                {fotosAntes.map((url, i) => (
                  <a key={url} href={url} target="_blank" rel="noopener">
                    <img src={url} alt={`Antes ${i + 1}`} />
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="admin-section-card">
            <div className="admin-subsection-title">
              <strong>Fotos do depois ({fotosDepois.length})</strong>
            </div>
            {fotosDepois.length === 0 ? (
              <p className="admin-empty-small">Nenhuma foto registrada.</p>
            ) : (
              <div className="admin-photo-grid">
                {fotosDepois.map((url, i) => (
                  <a key={url} href={url} target="_blank" rel="noopener">
                    <img src={url} alt={`Depois ${i + 1}`} />
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="admin-section-card">
            <div className="admin-subsection-title">
              <strong>Assinatura</strong>
            </div>
            {s.assinatura_url ? (
              <div className="admin-signature-box">
                <img src={s.assinatura_url} alt="Assinatura de quem acompanhou o serviço" />
                <p>
                  Assinado por: <strong>{s.assinatura_nome}</strong>
                  {s.conclusao_at ? ` · ${fmtDate(s.conclusao_at)}` : ''}
                </p>
              </div>
            ) : (
              <p className="admin-empty-small">Assinatura pendente (solicitada ao finalizar o atendimento).</p>
            )}
          </section>
        </div>

        <div className="admin-chamado-side">
          {isAdmin && (
            <section className="admin-section-card">
              <div className="admin-subsection-title">
                <strong>Atribuir técnico</strong>
              </div>
              <form action={atribuirTecnico}>
                <input type="hidden" name="id" value={s.id} />
                <select name="tecnico_id" defaultValue={s.tecnico_id ?? ''}>
                  <option value="">— Sem técnico —</option>
                  {tecnicos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
                <button type="submit" className="admin-save-btn">
                  <Icons name="check" size={15} /> Salvar
                </button>
              </form>
            </section>
          )}

          {s.status === 'novo' && (isAdmin || isTecnico) && (
            <IniciarForm action={iniciarAtendimento} chamadoId={s.id} />
          )}

          {s.status === 'em_andamento' && (isAdmin || isTecnico) && (
            <>
              <AdicionarFotosForm action={adicionarFotos} chamadoId={s.id} />
              <FinalizarForm action={finalizarAtendimento} chamadoId={s.id} />
            </>
          )}

          <section className="admin-section-card">
            <div className="admin-subsection-title">
              <strong>Ações</strong>
            </div>
            <ConfirmDelete
              action={deleteRequest}
              id={s.id}
              message={`Excluir o chamado ${s.numero}? As fotos e a assinatura também serão apagadas.`}
            >
              <Icons name="trash2" size={14} /> Excluir chamado
            </ConfirmDelete>
          </section>
        </div>
      </div>
    </div>
  );
}
