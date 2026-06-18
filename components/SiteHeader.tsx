export default function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-[5vw] py-4 bg-preto/90 backdrop-blur-md border-b border-laranja/20">
      <a href="/" className="font-display font-black text-2xl uppercase tracking-wide">
        Street <span className="text-laranja">Alma</span>
      </a>
      <nav className="hidden md:flex items-center gap-7 text-sm uppercase tracking-widest font-semibold">
        <a href="#sobre" className="text-cinza hover:text-laranja transition">Sobre</a>
        <a href="#modalidades" className="text-cinza hover:text-laranja transition">Modalidades</a>
        <a href="#galeria" className="text-cinza hover:text-laranja transition">Galeria</a>
        <a href="#horarios" className="text-cinza hover:text-laranja transition">Horários</a>
        <a href="/login" className="bg-laranja text-preto px-5 py-2 hover:bg-laranja-claro transition">
          Painel
        </a>
      </nav>
    </header>
  );
}
