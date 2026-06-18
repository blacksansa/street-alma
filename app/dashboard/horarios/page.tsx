'use client';

import { useEffect, useState } from 'react';
import { supabase, type Schedule } from '@/lib/supabase';

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function HorariosPage() {
  const [items, setItems] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [day, setDay] = useState('Segunda');
  const [time, setTime] = useState('');
  const [modality, setModality] = useState('');
  const [level, setLevel] = useState('');

  async function carregar() {
    const { data } = await supabase
      .from('schedules')
      .select('*')
      .order('id', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!time || !modality) return;
    setSalvando(true);
    const { error } = await supabase.from('schedules').insert({
      day,
      time,
      modality,
      level: level || null,
    });
    setSalvando(false);
    if (error) {
      alert('Erro ao salvar: ' + error.message);
      return;
    }
    setTime('');
    setModality('');
    setLevel('');
    carregar();
  }

  async function remover(id: number) {
    if (!confirm('Remover este horário?')) return;
    await supabase.from('schedules').delete().eq('id', id);
    carregar();
  }

  return (
    <div>
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-5xl mb-2">
        <span className="text-laranja">Horários</span>
      </h1>
      <p className="text-cinza mb-10">Cadastre, edite e remova as aulas da grade.</p>

      {/* Formulário */}
      <form
        onSubmit={adicionar}
        className="border-2 border-laranja bg-carvao p-6 md:p-8 mb-10"
      >
        <h2 className="font-display font-extrabold uppercase text-2xl mb-6">
          + Novo horário
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="label-base">Dia</label>
            <select className="input-base" value={day} onChange={(e) => setDay(e.target.value)}>
              {DIAS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Horário</label>
            <input
              className="input-base"
              placeholder="Ex: 19h — 20h30"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-base">Modalidade</label>
            <input
              className="input-base"
              placeholder="Ex: Hip Hop"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label-base">Turma / Nível</label>
            <input
              className="input-base"
              placeholder="Ex: Iniciante"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" disabled={salvando} className="btn-cheio mt-6 disabled:opacity-50">
          {salvando ? 'Salvando...' : 'Adicionar horário'}
        </button>
      </form>

      {/* Lista */}
      {loading ? (
        <p className="text-cinza">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-laranja/40 p-12 text-center text-cinza">
          Nenhum horário cadastrado. Use o formulário acima.
        </div>
      ) : (
        <>
          {/* Mobile: cards por dia */}
          <div className="flex flex-col gap-3 md:hidden">
            {DIAS.filter((dia) => items.some((s) => s.day === dia)).map((dia) => (
              <div key={dia} className="border-2 border-laranja">
                <div className="bg-preto px-4 py-2">
                  <span className="font-display font-extrabold uppercase text-laranja tracking-wide">{dia}</span>
                </div>
                <div className="divide-y divide-laranja/20">
                  {items.filter((s) => s.day === dia).map((s) => (
                    <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3 bg-carvao">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{s.modality}</p>
                        <p className="text-xs text-cinza mt-0.5">{s.time}</p>
                        {s.level && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-laranja mt-0.5">{s.level}</p>
                        )}
                      </div>
                      <button
                        onClick={() => remover(s.id)}
                        className="shrink-0 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden md:block border-2 border-laranja overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-preto">
                  <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Dia</th>
                  <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Horário</th>
                  <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Modalidade</th>
                  <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Turma</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-t border-laranja/20 bg-carvao">
                    <td className="px-5 py-4 text-laranja font-semibold">{s.day}</td>
                    <td className="px-5 py-4 text-sm">{s.time}</td>
                    <td className="px-5 py-4 text-sm">{s.modality}</td>
                    <td className="px-5 py-4 text-sm text-cinza">{s.level ?? '—'}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => remover(s.id)}
                        className="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
