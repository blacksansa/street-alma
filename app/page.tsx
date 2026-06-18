export const dynamic = 'force-dynamic';

import SiteHeader from '@/components/SiteHeader';
import PhotoGallery from '@/components/PhotoGallery';
import SchedulesTable from '@/components/SchedulesTable';
import { createServerSupabase, type Modality, type Address } from '@/lib/supabase';

const MODALITIES_FALLBACK: Omit<Modality, 'id' | 'position'>[] = [
  { name: 'Hip Hop', level: 'Iniciante ao avançado', description: 'Fundamentos, groove e coreografias.' },
  { name: 'Breaking', level: 'Todos os níveis', description: 'Top rock, footwork, power moves e freezes.' },
  { name: 'Kids', level: '6 a 12 anos', description: 'Coordenação, ritmo e diversão para crianças.' },
  { name: 'Coreográfico', level: 'Intermediário', description: 'Montagem de coreografias para eventos.' },
  { name: 'Treino da Cia', level: 'Seletiva', description: 'Treino fechado do elenco oficial.' },
];

async function getData() {
  const db = createServerSupabase();
  const [settingsRes, modalitiesRes, addressesRes] = await Promise.all([
    db.from('site_settings').select('*'),
    db.from('modalities').select('*').order('position', { ascending: true }),
    db.from('addresses').select('*').order('position', { ascending: true }),
  ]);

  const settings: Record<string, string> = {};
  settingsRes.data?.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });

  const modalities: Modality[] = modalitiesRes.data ?? [];
  const addresses: Address[] = addressesRes.data ?? [];

  return { settings, modalities, addresses };
}

export default async function HomePage() {
  const { settings, modalities, addresses } = await getData();

  const heroImageUrl = settings['hero_image_url'] ?? '';
  const instagram = settings['instagram'] ?? 'https://www.instagram.com/streetalmacompanydance/';
  const whatsapp = settings['whatsapp'] ?? '';
  const email = settings['email'] ?? '';

  const displayModalities = modalities.length > 0 ? modalities : MODALITIES_FALLBACK;

  return (
    <main>
      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-[5vw] pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,92,0,.14), transparent 70%), repeating-linear-gradient(115deg, transparent 0 120px, rgba(255,92,0,.03) 120px 122px)',
          }}
        />
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-laranja mb-5 relative">
          Companhia de dança urbana
        </p>
        <h1 className="font-display font-black uppercase leading-[0.88] text-6xl md:text-8xl lg:text-[10.5rem] relative">
          Dança de rua
          <br />
          <span style={{ WebkitTextStroke: '2px #FF5C00', color: 'transparent' }}>
            com alma
          </span>
        </h1>
        <p className="max-w-xl mt-7 text-cinza relative">
          Somos a Street Alma Company Dance. Movimento, música e comunidade no
          mesmo lugar — aulas para iniciantes e treinos para quem quer competir.
        </p>
        <div className="flex gap-4 mt-9 flex-wrap relative">
          <a className="btn-cheio" href="#horarios">Ver horários</a>
          <a className="btn-vazio" href="#galeria">Ver galeria</a>
        </div>

        {/* Marquee */}
        <div className="mt-14 border-y-2 border-laranja overflow-hidden whitespace-nowrap py-3 bg-preto relative">
          <div className="marquee-track inline-block font-display font-extrabold text-2xl uppercase tracking-wide">
            HIP HOP <span className="text-laranja mx-4">★</span>
            BREAKING <span className="text-laranja mx-4">★</span>
            POPPING <span className="text-laranja mx-4">★</span>
            LOCKING <span className="text-laranja mx-4">★</span>
            HOUSE <span className="text-laranja mx-4">★</span>
            DANÇAS URBANAS <span className="text-laranja mx-4">★</span>
            HIP HOP <span className="text-laranja mx-4">★</span>
            BREAKING <span className="text-laranja mx-4">★</span>
            POPPING <span className="text-laranja mx-4">★</span>
            LOCKING <span className="text-laranja mx-4">★</span>
            HOUSE <span className="text-laranja mx-4">★</span>
            DANÇAS URBANAS <span className="text-laranja mx-4">★</span>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="bg-carvao px-[5vw] py-24">
        <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl leading-none mb-12">
          Quem somos <span className="text-laranja">nós</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="mb-4">
              A <strong className="text-laranja">Street Alma Company Dance</strong> nasceu
              da paixão pela cultura hip hop e pela força que a dança tem de
              transformar pessoas. Aqui, cada aula é mais do que coreografia: é
              expressão, disciplina e família.
            </p>
            <p className="text-cinza">
              Nosso trabalho une formação técnica em danças urbanas com
              apresentações, campeonatos e ações na comunidade.
            </p>
            <div className="flex gap-12 mt-10 flex-wrap">
              <div>
                <div className="font-display font-black text-5xl text-laranja leading-none">+100</div>
                <div className="text-xs uppercase tracking-widest text-cinza mt-1">Alunos</div>
              </div>
              <div>
                <div className="font-display font-black text-5xl text-laranja leading-none">
                  {displayModalities.length}
                </div>
                <div className="text-xs uppercase tracking-widest text-cinza mt-1">Modalidades</div>
              </div>
              <div>
                <div className="font-display font-black text-5xl text-laranja leading-none">+20</div>
                <div className="text-xs uppercase tracking-widest text-cinza mt-1">Apresentações</div>
              </div>
            </div>
          </div>

          {/* Foto do grupo */}
          <div className="aspect-[4/5] border-2 border-laranja relative overflow-hidden bg-grafite flex items-center justify-center">
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImageUrl}
                alt="Foto do grupo Street Alma"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-3.5 border border-dashed border-laranja/40 pointer-events-none" />
                <p className="text-cinza text-center max-w-[60%] text-sm">
                  Foto do grupo<br />(adicione pelo painel)
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section id="modalidades" className="px-[5vw] py-24">
        <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl leading-none mb-3">
          Nossas <span className="text-laranja">modalidades</span>
        </h2>
        <p className="text-cinza max-w-xl mb-12">A primeira aula experimental é por nossa conta.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-laranja/30 border-2 border-laranja">
          {displayModalities.map((m) => (
            <div key={m.name} className="bg-preto p-8 hover:bg-grafite transition">
              <h3 className="font-display font-extrabold uppercase text-2xl mb-2">{m.name}</h3>
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-laranja border border-laranja px-2 py-0.5 mb-3">
                {m.level}
              </span>
              <p className="text-cinza text-sm">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HORÁRIOS */}
      <section id="horarios" className="bg-carvao px-[5vw] py-24">
        <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl leading-none mb-3">
          Grade de <span className="text-laranja">horários</span>
        </h2>
        <p className="text-cinza max-w-xl mb-12">Confira as turmas e venha treinar.</p>
        <SchedulesTable whatsapp={whatsapp} />
      </section>

      {/* GALERIA */}
      <section id="galeria" className="px-[5vw] py-24">
        <h2 className="font-display font-extrabold uppercase text-5xl md:text-7xl leading-none mb-3">
          Galeria de <span className="text-laranja">fotos</span>
        </h2>
        <p className="text-cinza max-w-xl mb-12">Registros das aulas, apresentações e treinos.</p>
        <PhotoGallery />
      </section>

      {/* FOOTER */}
      <footer className="bg-preto border-t-2 border-laranja px-[5vw] py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-display font-black text-2xl uppercase">
              Street <span className="text-laranja">Alma</span>
            </div>
            <p className="text-cinza mt-3 text-sm">
              Dança de rua com alma. Aulas, apresentações e cultura urbana.
            </p>
          </div>
          <div>
            <h4 className="font-display font-extrabold uppercase text-laranja text-xl mb-3">Contato</h4>
            {instagram && (
              <a
                className="block text-cinza text-sm mb-1 hover:text-laranja"
                href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener"
              >
                {instagram.startsWith('http')
                  ? `@${instagram.split('/').filter(Boolean).pop()}`
                  : instagram}
              </a>
            )}
            {whatsapp && (
              <a
                className="block text-cinza text-sm mb-1 hover:text-laranja"
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener"
              >
                {whatsapp}
              </a>
            )}
            {email && (
              <a
                className="block text-cinza text-sm mb-1 hover:text-laranja"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            )}
          </div>

          {/* Endereços */}
          {addresses.length > 0 && (
            <div>
              <h4 className="font-display font-extrabold uppercase text-laranja text-xl mb-3">
                {addresses.length === 1 ? 'Endereço' : 'Endereços'}
              </h4>
              <div className="flex flex-col gap-3">
                {addresses.map((a) => (
                  <div key={a.id}>
                    {a.label && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-laranja block mb-0.5">
                        {a.label}
                      </span>
                    )}
                    <p className="text-cinza text-sm">{a.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h4 className="font-display font-extrabold uppercase text-laranja text-xl mb-3">Admin</h4>
            <a className="block text-cinza text-sm hover:text-laranja" href="/login">
              Acessar painel
            </a>
          </div>
        </div>
        <div className="border-t border-laranja/20 pt-6 text-xs text-cinza flex flex-wrap justify-between gap-2">
          <span>© 2026 Street Alma Company Dance.</span>
          <span>Feito com ♥ e muito groove.</span>
        </div>
      </footer>
    </main>
  );
}
