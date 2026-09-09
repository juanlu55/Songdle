export default function GameFooter() {
  return (
    <footer className="mt-6 text-center" role="contentinfo">
      <nav className="flex justify-center gap-4 text-xs font-bold uppercase tracking-wide flex-wrap" aria-label="Enlaces de navegación">
        <a
          href="/como-jugar"
          className="text-black/50 hover:text-black transition-colors underline-offset-2 hover:underline"
        >
          Cómo jugar
        </a>
        <span className="text-black/30">•</span>
        <a
          href="/heardle-espanol"
          className="text-black/50 hover:text-black transition-colors underline-offset-2 hover:underline"
        >
          Alternativa a Heardle
        </a>
        <span className="text-black/30">•</span>
        <a
          href="/sobre-songdle"
          className="text-black/50 hover:text-black transition-colors underline-offset-2 hover:underline"
        >
          Sobre Songdle
        </a>
      </nav>
      <p className="mt-2 text-[10px] text-black/40 font-medium">
        © {new Date().getFullYear()} Songdle — El Wordle de canciones
      </p>
    </footer>
  );
}
