import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente para uso em Client Components (browser)
export const supabase = createClient(url, anonKey);

// Cliente para uso em Server Components — nunca cacheia
export function createServerSupabase() {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  });
}

export type Schedule = {
  id: number;
  day: string;
  time: string;
  modality: string;
  level: string | null;
  created_at: string;
};

export type GalleryPhoto = {
  id: number;
  url: string;
  caption: string | null;
  created_at: string;
};

export type Modality = {
  id: number;
  name: string;
  level: string;
  description: string;
  position: number;
};

export type SiteSetting = {
  key: string;
  value: string;
};

export type Address = {
  id: number;
  label: string;
  address: string;
  position: number;
};
