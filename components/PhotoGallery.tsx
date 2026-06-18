'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, type GalleryPhoto } from '@/lib/supabase';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(photos.length - 1, i));
    setCurrent(clamped);
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[clamped] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track || photos.length === 0) return;
    const cardWidth = (track.children[0] as HTMLElement)?.offsetWidth ?? 1;
    const idx = Math.round(track.scrollLeft / (cardWidth + 8));
    setCurrent(Math.max(0, Math.min(photos.length - 1, idx)));
  }

  if (loading) return <p className="text-cinza">Carregando fotos...</p>;

  if (photos.length === 0) {
    return (
      <div className="border-2 border-dashed border-laranja/40 p-16 text-center">
        <p className="text-cinza">
          Nenhuma foto ainda. Adicione pelo{' '}
          <a href="/dashboard/galeria" className="text-laranja underline">painel</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Setas desktop */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="Anterior"
            className="absolute left-0 top-[40%] z-10 -translate-x-5 bg-preto border-2 border-laranja w-10 h-10 items-center justify-center text-laranja text-xl disabled:opacity-20 hidden md:flex hover:bg-laranja hover:text-preto transition"
          >
            ←
          </button>
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === photos.length - 1}
            aria-label="Próximo"
            className="absolute right-0 top-[40%] z-10 translate-x-5 bg-preto border-2 border-laranja w-10 h-10 items-center justify-center text-laranja text-xl disabled:opacity-20 hidden md:flex hover:bg-laranja hover:text-preto transition"
          >
            →
          </button>
        </>
      )}

      {/* Trilha de fotos */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            className="snap-start shrink-0 w-56 md:w-72 border-2 border-laranja bg-preto overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt={p.caption ?? 'Foto da dança'}
              className="w-full h-56 md:h-72 object-cover"
              loading="lazy"
            />
            {p.caption && (
              <p className="px-3 py-2 text-xs text-cinza truncate">{p.caption}</p>
            )}
          </div>
        ))}
      </div>

      {/* Contador + dots */}
      {photos.length > 1 && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-xs text-cinza font-mono">
            {current + 1} / {photos.length}
          </span>
          <div className="flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-6 bg-laranja' : 'w-1.5 bg-laranja/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
