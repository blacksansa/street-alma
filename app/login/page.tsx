'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HARDCODED_USER, HARDCODED_PASS, setAuthCookie } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [erro, setErro] = useState('');

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (user === HARDCODED_USER && pass === HARDCODED_PASS) {
      setAuthCookie();
      router.push('/dashboard');
    } else {
      setErro('Usuário ou senha incorretos.');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <a href="/" className="font-display font-black text-3xl uppercase block text-center mb-8">
          Street <span className="text-laranja">Alma</span>
        </a>

        <div className="border-2 border-laranja bg-carvao p-8">
          <h1 className="font-display font-extrabold uppercase text-3xl mb-1">Painel</h1>
          <p className="text-cinza text-sm mb-7">Acesso restrito ao administrador.</p>

          <form onSubmit={entrar} className="flex flex-col gap-5">
            <div>
              <label className="label-base" htmlFor="user">Usuário</label>
              <input
                id="user"
                className="input-base"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="label-base" htmlFor="pass">Senha</label>
              <input
                id="pass"
                type="password"
                className="input-base"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {erro && (
              <div className="border border-red-500 bg-red-500/10 text-red-400 text-sm px-3 py-2">
                {erro}
              </div>
            )}

            <button type="submit" className="btn-cheio w-full">Entrar</button>
          </form>

          <p className="text-cinza text-xs mt-6 text-center">
            Dica: usuário <code className="text-laranja">magno</code> / senha <code className="text-laranja">123</code>
          </p>
        </div>

        <a href="/" className="block text-center text-cinza text-sm mt-6 hover:text-laranja">
          ← Voltar ao site
        </a>
      </div>
    </main>
  );
}
