'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, type GalleryPhoto } from '@/lib/supabase';

const BUCKET = 'gallery';

export default function GaleriaPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function carregar() {
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      alert('Selecione uma foto.');
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Erro no upload');

      const { error: insErr } = await supabase.from('gallery_photos').insert({
        url: json.publicUrl,
        caption: caption || null,
      });
      if (insErr) throw insErr;

      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
      carregar();
    } catch (err: any) {
      alert('Erro ao enviar: ' + (err?.message ?? 'desconhecido'));
    } finally {
      setUploading(false);
    }
  }

  async function remover(p: GalleryPhoto) {
    if (!confirm('Remover esta foto?')) return;

    // Extrai o path do arquivo a partir da URL pública
    const marker = `/object/public/${BUCKET}/`;
    const idx = p.url.indexOf(marker);
    if (idx !== -1) {
      const path = p.url.slice(idx + marker.length);
      await supabase.storage.from(BUCKET).remove([path]);
    }
    await supabase.from('gallery_photos').delete().eq('id', p.id);
    carregar();
  }

  return (
    <div>
      <h1 className="font-display font-extrabold uppercase text-4xl md:text-5xl mb-2">
        <span className="text-laranja">Galeria</span>
      </h1>
      <p className="text-cinza mb-10">Adicione fotos das aulas e apresentações.</p>

      {/* Upload */}
      <form onSubmit={upload} className="border-2 border-laranja bg-carvao p-6 md:p-8 mb-10">
        <h2 className="font-display font-extrabold uppercase text-2xl mb-6">+ Nova foto</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="label-base">Arquivo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              required
              className="input-base file:bg-laranja file:text-preto file:border-0 file:font-bold file:uppercase file:tracking-widest file:px-4 file:py-2 file:mr-4 file:cursor-pointer cursor-pointer"
            />
          </div>
          <div>
            <label className="label-base">Legenda (opcional)</label>
            <input
              className="input-base"
              placeholder="Ex: Apresentação no festival 2026"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" disabled={uploading} className="btn-cheio mt-6 disabled:opacity-50">
          {uploading ? 'Enviando...' : 'Enviar foto'}
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <p className="text-cinza">Carregando...</p>
      ) : photos.length === 0 ? (
        <div className="border-2 border-dashed border-laranja/40 p-12 text-center text-cinza">
          Nenhuma foto na galeria.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="border-2 border-laranja bg-carvao group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.caption ?? ''} className="w-full aspect-square object-cover" />
              <div className="p-3">
                <p className="text-xs text-cinza truncate">{p.caption ?? 'Sem legenda'}</p>
                <button
                  onClick={() => remover(p)}
                  className="mt-2 text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-300"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
