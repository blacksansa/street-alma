'use client';

import { useRouter, usePathname } from 'next/navigation';
import { clearAuthCookie } from '@/lib/auth';

const links = [
  { href: '/dashboard', label: 'Início', icon: '◆' },
  { href: '/dashboard/horarios', label: 'Horários', icon: '◷' },
  { href: '/dashboard/galeria', label: 'Galeria', icon: '◫' },
  { href: '/dashboard/modalidades', label: 'Modalidades', icon: '◈' },
  { href: '/dashboard/configuracoes', label: 'Config.', icon: '◎' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  function sair() {
    clearAuthCookie();
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-64 bg-carvao border-r-2 border-laranja flex md:flex-col">
        <div className="p-6 border-b-2 border-laranja flex-shrink-0">
          <a href="/" className="font-display font-black text-xl uppercase block">
            Street <span className="text-laranja">Alma</span>
          </a>
          <p className="text-cinza text-xs mt-1">Painel admin</p>
        </div>

        <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-x-visible">
          {links.map((l) => {
            const ativo = pathname === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`px-6 py-4 border-b border-laranja/10 text-sm uppercase tracking-widest font-semibold whitespace-nowrap transition ${
                  ativo
                    ? 'bg-laranja text-preto'
                    : 'text-cinza hover:bg-grafite hover:text-laranja'
                }`}
              >
                <span className="mr-2">{l.icon}</span>
                {l.label}
              </a>
            );
          })}
        </nav>

        <button
          onClick={sair}
          className="px-6 py-4 text-sm uppercase tracking-widest font-semibold text-cinza hover:bg-grafite hover:text-laranja transition border-t border-laranja/10 md:mt-auto text-left whitespace-nowrap"
        >
          ⏻ Sair
        </button>
      </aside>

      {/* Conteúdo */}
      <main className="flex-1 p-6 md:p-12">{children}</main>
    </div>
  );
}
