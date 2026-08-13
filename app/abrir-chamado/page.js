import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappFloat from '@/components/WhatsappFloat';
import RevealObserver from '@/components/RevealObserver';
import BannerDecor from '@/components/BannerDecor';
import Solicitacao from '@/components/sections/Solicitacao';

export const metadata = {
  title: 'Abrir Chamado | WA Soluções Integradas',
  description:
    'Abra um chamado de manutenção ou instalação para sua loja, consultório, escritório ou sala comercial. A WA Soluções Integradas atende empresas B2B em São Paulo.',
};

export default function AbrirChamadoPage() {
  return (
    <>
      <Header />

      <main>
        <section className="chamado-hero">
          <BannerDecor />
          <div className="container">
            <span className="section-tag">Chamado Técnico</span>
            <h1 className="hero-title">Abrir Chamado</h1>
            <p className="hero-subtitle">
              Preencha os dados abaixo e nossa equipe entrará em contato.
            </p>
            <p className="hero-description">
              Descreva o problema ou serviço necessário no seu espaço comercial. Chamados com operação parada têm
              prioridade no agendamento.
            </p>
          </div>
        </section>

        <Solicitacao />
      </main>

      <Footer />
      <WhatsappFloat />
      <RevealObserver />
    </>
  );
}
