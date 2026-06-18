'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardHome() {
  const [stats, setStats] = useState({ horarios: 0, fotos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('schedules').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
    ]).then(([s, p]) => {
      setStats({ horarios: s.count ?? 0, fotos: p.count ?? 0 });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-5xl mb-2">
        Bem-vindo, <span className="text-laranja">Magno</span>
      </h1>
      <p className="text-cinza mb-12">Gerencie a grade de horários e a galeria de fotos.</p>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <a
          href="/dashboard/horarios"
          className="block border-2 border-laranja p-8 bg-carvao hover:bg-grafite transition group"
        >
          <div className="text-cinza text-xs uppercase tracking-widest mb-3">Horários cadastrados</div>
          <div className="font-display font-black text-7xl text-laranja leading-none mb-3">
            {loading ? '—' : stats.horarios}
          </div>
          <div className="text-areia uppercase tracking-widest text-xs font-bold group-hover:text-laranja transition">
            Gerenciar →
          </div>
        </a>

        <a
          href="/dashboard/galeria"
          className="block border-2 border-laranja p-8 bg-carvao hover:bg-grafite transition group"
        >
          <div className="text-cinza text-xs uppercase tracking-widest mb-3">Fotos na galeria</div>
          <div className="font-display font-black text-7xl text-laranja leading-none mb-3">
            {loading ? '—' : stats.fotos}
          </div>
          <div className="text-areia uppercase tracking-widest text-xs font-bold group-hover:text-laranja transition">
            Gerenciar →
          </div>
        </a>
      </div>

      {/* Atalhos */}
      <div className="border-2 border-laranja/40 p-6 md:p-8">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-4">Atalhos rápidos</h2>
        <div className="flex gap-4 flex-wrap">
          <a href="/dashboard/horarios" className="btn-vazio">+ Novo horário</a>
          <a href="/dashboard/galeria" className="btn-vazio">+ Nova foto</a>
          <a href="/" target="_blank" rel="noopener" className="btn-vazio">Ver site público ↗</a>
        </div>
      </div>
    </div>
  );
}
