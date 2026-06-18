'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, type Address } from '@/lib/supabase';

const KEYS = ['hero_image_url', 'instagram', 'whatsapp', 'email'] as const;
type Key = (typeof KEYS)[number];

const LABELS: Record<Key, string> = {
  hero_image_url: 'Foto do grupo (URL)',
  instagram: 'Instagram (link ou @usuario)',
  whatsapp: 'WhatsApp (com DDD)',
  email: 'E-mail de contato',
};

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<Record<Key, string>>({
    hero_image_url: '',
    instagram: '',
    whatsapp: '',
    email: '',
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [addingAddr, setAddingAddr] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function carregar() {
    const [settingsRes, addressesRes] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('addresses').select('*').order('position', { ascending: true }),
    ]);
    if (settingsRes.data) {
      const m: Partial<Record<Key, string>> = {};
      settingsRes.data.forEach((r: { key: string; value: string }) => {
        if (KEYS.includes(r.key as Key)) m[r.key as Key] = r.value;
      });
      setValues((v) => ({ ...v, ...m }));
    }
    if (addressesRes.data) setAddresses(addressesRes.data);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const rows = KEYS.map((k) => ({ key: k, value: values[k] }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    setSalvando(false);
    if (error) { alert('Erro ao salvar: ' + error.message); return; }
    alert('Configurações salvas!');
  }

  async function uploadHero() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploadando(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Erro no upload');

      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'hero_image_url', value: json.publicUrl }, { onConflict: 'key' });
      if (error) throw new Error(error.message);

      setValues((v) => ({ ...v, hero_image_url: json.publicUrl }));
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: unknown) {
      alert('Erro ao enviar: ' + (err instanceof Error ? err.message : 'desconhecido'));
    } finally {
      setUploadando(false);
    }
  }

  async function adicionarEndereco(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddress) return;
    setAddingAddr(true);
    const position = addresses.length > 0 ? Math.max(...addresses.map((a) => a.position)) + 1 : 1;
    const { error } = await supabase.from('addresses').insert({
      label: newLabel || '',
      address: newAddress,
      position,
    });
    setAddingAddr(false);
    if (error) { alert('Erro: ' + error.message); return; }
    setNewLabel('');
    setNewAddress('');
    carregar();
  }

  async function removerEndereco(id: number) {
    if (!confirm('Remover este endereço?')) return;
    await supabase.from('addresses').delete().eq('id', id);
    carregar();
  }

  if (loading) return <p className="text-cinza">Carregando...</p>;

  return (
    <div>
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-5xl mb-2">
        <span className="text-laranja">Configurações</span>
      </h1>
      <p className="text-cinza mb-10">Foto do grupo, contatos e endereços exibidos no site.</p>

      {/* Upload da foto do grupo */}
      <div className="border-2 border-laranja bg-carvao p-6 md:p-8 mb-8">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-4">Foto do grupo</h2>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {values.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={values.hero_image_url}
              alt="Foto atual"
              className="w-40 h-52 object-cover border-2 border-laranja shrink-0"
            />
          ) : (
            <div className="w-40 h-52 border-2 border-dashed border-laranja/40 flex items-center justify-center text-cinza text-xs text-center p-4 shrink-0">
              Nenhuma foto
            </div>
          )}
          <div className="flex-1">
            <label className="label-base">Enviar nova foto</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="input-base file:bg-laranja file:text-preto file:border-0 file:font-bold file:uppercase file:tracking-widest file:px-4 file:py-2 file:mr-4 file:cursor-pointer cursor-pointer"
            />
            <button
              type="button"
              onClick={uploadHero}
              disabled={uploadando}
              className="btn-cheio mt-4 disabled:opacity-50"
            >
              {uploadando ? 'Enviando...' : 'Enviar foto'}
            </button>
            <p className="text-cinza text-xs mt-2">
              A foto é salva automaticamente após o envio.
            </p>
          </div>
        </div>
      </div>

      {/* Contato */}
      <form onSubmit={salvar} className="border-2 border-laranja bg-carvao p-6 md:p-8 mb-8">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-6">Contato</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {(KEYS.filter((k) => k !== 'hero_image_url') as Key[]).map((k) => (
            <div key={k}>
              <label className="label-base">{LABELS[k]}</label>
              <input
                className="input-base"
                value={values[k]}
                onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
                placeholder={
                  k === 'instagram' ? 'https://instagram.com/perfil ou @perfil'
                  : k === 'whatsapp' ? '22 99999-9999'
                  : 'contato@email.com'
                }
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={salvando} className="btn-cheio mt-6 disabled:opacity-50">
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      {/* Endereços */}
      <div className="border-2 border-laranja bg-carvao p-6 md:p-8">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-6">Endereços</h2>

        {/* Lista de endereços */}
        {addresses.length === 0 ? (
          <p className="text-cinza text-sm mb-6">Nenhum endereço cadastrado.</p>
        ) : (
          <div className="mb-6 divide-y divide-laranja/20 border border-laranja/20">
            {addresses.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div>
                  {a.label && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-laranja block mb-0.5">
                      {a.label}
                    </span>
                  )}
                  <span className="text-sm">{a.address}</span>
                </div>
                <button
                  onClick={() => removerEndereco(a.id)}
                  className="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300 shrink-0"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulário novo endereço */}
        <form onSubmit={adicionarEndereco}>
          <h3 className="font-display font-extrabold uppercase text-lg mb-4">+ Novo endereço</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="label-base">Rótulo (opcional)</label>
              <input
                className="input-base"
                placeholder="Ex: Unidade Centro, Unidade Barra"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>
            <div>
              <label className="label-base">Endereço</label>
              <input
                className="input-base"
                placeholder="Ex: Rua das Flores, 123 — Rio das Ostras, RJ"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={addingAddr} className="btn-cheio mt-4 disabled:opacity-50">
            {addingAddr ? 'Adicionando...' : 'Adicionar endereço'}
          </button>
        </form>
      </div>
    </div>
  );
}
