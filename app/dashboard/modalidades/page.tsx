'use client';

import { useEffect, useState } from 'react';
import { supabase, type Modality } from '@/lib/supabase';

export default function ModalidadesPage() {
  const [items, setItems] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [description, setDescription] = useState('');

  async function carregar() {
    const { data } = await supabase
      .from('modalities')
      .select('*')
      .order('position', { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !level || !description) return;
    setSalvando(true);
    const position = items.length > 0 ? Math.max(...items.map(i => i.position)) + 1 : 1;
    const { error } = await supabase.from('modalities').insert({ name, level, description, position });
    setSalvando(false);
    if (error) { alert('Erro: ' + error.message); return; }
    setName(''); setLevel(''); setDescription('');
    carregar();
  }

  async function remover(id: number) {
    if (!confirm('Remover esta modalidade?')) return;
    await supabase.from('modalities').delete().eq('id', id);
    carregar();
  }

  async function moverCima(item: Modality, idx: number) {
    if (idx === 0) return;
    const prev = items[idx - 1];
    await Promise.all([
      supabase.from('modalities').update({ position: prev.position }).eq('id', item.id),
      supabase.from('modalities').update({ position: item.position }).eq('id', prev.id),
    ]);
    carregar();
  }

  async function moverBaixo(item: Modality, idx: number) {
    if (idx === items.length - 1) return;
    const next = items[idx + 1];
    await Promise.all([
      supabase.from('modalities').update({ position: next.position }).eq('id', item.id),
      supabase.from('modalities').update({ position: item.position }).eq('id', next.id),
    ]);
    carregar();
  }

  return (
    <div>
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-5xl mb-2">
        <span className="text-laranja">Modalidades</span>
      </h1>
      <p className="text-cinza mb-10">Gerencie as modalidades exibidas no site.</p>

      {/* Formulário */}
      <form onSubmit={adicionar} className="border-2 border-laranja bg-carvao p-6 md:p-8 mb-10">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-6">+ Nova modalidade</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="label-base">Nome</label>
            <input className="input-base" placeholder="Ex: Hip Hop" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label-base">Nível / Público</label>
            <input className="input-base" placeholder="Ex: Iniciante ao avançado" value={level}
              onChange={(e) => setLevel(e.target.value)} required />
          </div>
          <div>
            <label className="label-base">Descrição</label>
            <input className="input-base" placeholder="Ex: Fundamentos e coreografias." value={description}
              onChange={(e) => setDescription(e.target.value)} required />
          </div>
        </div>
        <button type="submit" disabled={salvando} className="btn-cheio mt-6 disabled:opacity-50">
          {salvando ? 'Salvando...' : 'Adicionar'}
        </button>
      </form>

      {/* Lista */}
      {loading ? (
        <p className="text-cinza">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="border-2 border-dashed border-laranja/40 p-12 text-center text-cinza">
          Nenhuma modalidade. Use o formulário acima.
        </div>
      ) : (
        <div className="border-2 border-laranja overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-preto">
                <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Nome</th>
                <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Nível</th>
                <th className="text-left px-5 py-4 font-display text-lg uppercase tracking-wide text-laranja">Descrição</th>
                <th className="px-5 py-4 text-right text-laranja font-display text-lg uppercase tracking-wide">Ordem</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m, idx) => (
                <tr key={m.id} className="border-t border-laranja/20 bg-carvao">
                  <td className="px-5 py-4 font-semibold text-laranja">{m.name}</td>
                  <td className="px-5 py-4 text-sm">{m.level}</td>
                  <td className="px-5 py-4 text-sm text-cinza">{m.description}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => moverCima(m, idx)} disabled={idx === 0}
                        className="text-xs border border-laranja/40 px-2 py-1 disabled:opacity-20 hover:bg-grafite">↑</button>
                      <button onClick={() => moverBaixo(m, idx)} disabled={idx === items.length - 1}
                        className="text-xs border border-laranja/40 px-2 py-1 disabled:opacity-20 hover:bg-grafite">↓</button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => remover(m.id)}
                      className="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300">
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
