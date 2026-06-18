'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { clearAuthCookie } from '@/lib/auth';

const links = [
  { href: '/dashboard', label: 'Início', icon: '◆' },
  { href: '/dashboard/horarios', label: 'Horários', icon: '◷' },
  { href: '/dashboard/galeria', label: 'Galeria', icon: '◫' },
  { href: '/dashboard/modalidades', label: 'Modalidades', icon: '◈' },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: '◎' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);

  function sair() {
    clearAuthCookie();
    router.push('/login');
  }

  const paginaAtual = links.find((l) => l.href === pathname)?.label ?? 'Painel';

  return (
    <div className="min-h-screen flex bg-preto">
      {/* Overlay mobile */}
      {aberto && (
        <div
          className="fixed inset-0 z-20 bg-preto/70 md:hidden"
          onClick={() => setAberto(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-carvao border-r-2 border-laranja flex flex-col
          transition-transform duration-200
          ${aberto ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b-2 border-laranja shrink-0">
          <a href="/" className="font-display font-black text-xl uppercase block">
            Street <span className="text-laranja">Alma</span>
          </a>
          <p className="text-cinza text-xs mt-1">Painel admin</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col flex-1 py-2 overflow-y-auto">
          {links.map((l) => {
            const ativo = pathname === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className={`flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-widest font-semibold transition ${
                  ativo
                    ? 'bg-laranja text-preto'
                    : 'text-cinza hover:bg-grafite hover:text-laranja'
                }`}
              >
                <span className="text-base">{l.icon}</span>
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* Sair */}
        <button
          onClick={sair}
          className="flex items-center gap-3 px-6 py-4 text-sm uppercase tracking-widest font-semibold text-cinza hover:bg-grafite hover:text-laranja transition border-t border-laranja/20 shrink-0"
        >
          <span>⏻</span> Sair
        </button>
      </aside>

      {/* Área principal */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar mobile */}
        <header className="md:hidden flex items-center gap-4 px-4 py-3 bg-carvao border-b-2 border-laranja shrink-0">
          <button
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="flex flex-col gap-1.5 p-1"
          >
            <span className="block w-6 h-0.5 bg-laranja" />
            <span className="block w-6 h-0.5 bg-laranja" />
            <span className="block w-6 h-0.5 bg-laranja" />
          </button>
          <span className="font-display font-extrabold uppercase text-laranja tracking-wide">
            {paginaAtual}
          </span>
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
