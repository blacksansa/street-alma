'use client';

import { useEffect, useState } from 'react';
import { supabase, type Schedule } from '@/lib/supabase';

const DIA_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function whatsappLink(whatsapp: string, s: Schedule) {
  const numero = whatsapp.replace(/\D/g, '');
  const texto = encodeURIComponent(
    `Olá! Gostaria de agendar uma aula de ${s.modality}${s.level ? ` (${s.level})` : ''} — ${s.day} às ${s.time}.`
  );
  return `https://wa.me/55${numero}?text=${texto}`;
}

export default function SchedulesTable({ whatsapp = '' }: { whatsapp?: string }) {
  const [items, setItems] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('schedules')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-cinza">Carregando horários...</p>;

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-laranja/40 p-12 text-center text-cinza">
        Nenhum horário cadastrado ainda.
      </div>
    );
  }

  const porDia = DIA_ORDER.reduce<Record<string, Schedule[]>>((acc, dia) => {
    const do_dia = items.filter((s) => s.day === dia);
    if (do_dia.length) acc[dia] = do_dia;
    return acc;
  }, {});

  return (
    <>
      {/* Mobile: cards por dia */}
      <div className="flex flex-col gap-3 md:hidden">
        {Object.entries(porDia).map(([dia, aulas]) => (
          <div key={dia} className="border-2 border-laranja">
            <div className="bg-preto px-4 py-2">
              <span className="font-display font-extrabold uppercase text-laranja tracking-wide">
                {dia}
              </span>
            </div>
            <div className="divide-y divide-laranja/20">
              {aulas.map((s) => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-3 bg-carvao">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{s.modality}</p>
                    <p className="text-xs text-cinza mt-0.5">{s.time}</p>
                    {s.level && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-laranja mt-0.5">
                        {s.level}
                      </p>
                    )}
                  </div>
                  {whatsapp && (
                    <a
                      href={whatsappLink(whatsapp, s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[10px] font-bold uppercase tracking-widest border-2 border-laranja text-laranja px-3 py-1.5 hover:bg-laranja hover:text-preto transition whitespace-nowrap"
                    >
                      Agendar
                    </a>
                  )}
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
              {whatsapp && <th className="px-5 py-4" />}
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-laranja/20 bg-carvao">
                <td className="px-5 py-4 text-laranja font-semibold">{s.day}</td>
                <td className="px-5 py-4 text-sm">{s.time}</td>
                <td className="px-5 py-4 text-sm">{s.modality}</td>
                <td className="px-5 py-4 text-sm text-cinza">{s.level ?? '—'}</td>
                {whatsapp && (
                  <td className="px-5 py-4 text-right">
                    <a
                      href={whatsappLink(whatsapp, s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[10px] font-bold uppercase tracking-widest border-2 border-laranja text-laranja px-4 py-2 hover:bg-laranja hover:text-preto transition"
                    >
                      Agendar
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
