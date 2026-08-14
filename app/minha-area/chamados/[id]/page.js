import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/roles';
import { STATUS_META, TIPO_META, fmtDate } from '@/lib/status';
import Icons from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function MinhaAreaChamado({ params }) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || getUserRole(user) !== 'cliente') redirect('/admin/login');

  const admin = createAdminClient();
  const { data: s } = await admin.from('solicitacoes').select('*').eq('id', id).maybeSingle();
  if (!s) notFound();

  if ((s.email ?? '').toLowerCase() !== (user.email ?? '').toLowerCase()) {
    redirect('/minha-area');
  }

  const fotosAntes = Array.isArray(s.fotos_antes) ? s.fotos_antes : [];
  const fotosDepois = Array.isArray(s.fotos_depois) ? s.fotos_depois : [];
  const statusMeta = STATUS_META[s.status] ?? { label: s.status, className: 'novo' };
  const tipoMeta = TIPO_META[s.tipo] ?? { label: s.tipo, className: 'tipo-atendimento' };

  const timeline = [
    { label: 'Chamado aberto', date: s.created_at, done: true },
    { label: 'Atendimento iniciado', date: s.inicio_at, done: Boolean(s.inicio_at) },
    { label: 'Atendimento concluído', date: s.conclusao_at, done: Boolean(s.conclusao_at) },
  ];

  return (
    <div className="portal-body">
      <Link href="/minha-area" className="admin-back-link">
        ← Voltar para Minha área
      </Link>

      <div className="portal-chamado-head">
        <div>
          <h1>
            Chamado <span className="admin-numero">{s.numero}</span>
          </h1>
          <p>
            Aberto em {fmtDate(s.created_at)} · {s.servico}
          </p>
        </div>
        <div className="portal-chamado-badges">
          <span className={`admin-badge ${statusMeta.className}`}>{statusMeta.label}</span>
          <span className={`admin-badge ${tipoMeta.className}`}>{tipoMeta.label}</span>
        </div>
      </div>

      <section className="portal-card">
        <h2>Descrição</h2>
        <p>{s.descricao}</p>
      </section>

      <section className="portal-card">
        <h2>Acompanhamento</h2>
        <div className="portal-timeline">
          {timeline.map((step, i) => (
            <div key={step.label} className={`portal-timeline-step${step.done ? ' done' : ''}`}>
              <div className="portal-timeline-dot">
                {step.done ? <Icons name="check" size={13} /> : <Icons name="clock" size={13} />}
              </div>
              <div>
                <strong>{step.label}</strong>
                <small>{step.date ? fmtDate(step.date) : 'Aguardando'}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="portal-card">
        <h2>Fotos do antes ({fotosAntes.length})</h2>
        {fotosAntes.length === 0 ? (
          <p className="portal-muted">Nenhuma foto registrada ainda.</p>
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

      <section className="portal-card">
        <h2>Fotos do depois ({fotosDepois.length})</h2>
        {fotosDepois.length === 0 ? (
          <p className="portal-muted">Nenhuma foto registrada ainda.</p>
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

      <section className="portal-card">
        <h2>Assinatura do serviço</h2>
        {s.assinatura_url ? (
          <div className="admin-signature-box">
            <img src={s.assinatura_url} alt="Assinatura de quem acompanhou o serviço" />
            <p>
              Assinado por: <strong>{s.assinatura_nome}</strong>
              {s.conclusao_at ? ` · ${fmtDate(s.conclusao_at)}` : ''}
            </p>
          </div>
        ) : (
          <p className="portal-muted">A assinatura é coletada quando o atendimento for concluído.</p>
        )}
      </section>
    </div>
  );
}
