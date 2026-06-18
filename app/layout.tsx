import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Street Alma Company Dance',
  description: 'Dança de rua com alma — aulas, apresentações e cultura urbana.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
