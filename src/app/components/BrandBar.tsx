import Link from "next/link";
import { Logo } from "./Brand";

/** Barra superior de las páginas de contenido: logo a la izquierda, volver a jugar a la derecha */
export default function BrandBar({ cta = "Jugar" }: { cta?: string }) {
  return (
    <div className="mb-8 flex items-center justify-between gap-3">
      <Link href="/" aria-label="Songdle, ir al juego del día" className="text-2xl sm:text-3xl text-black">
        <Logo />
      </Link>
      <Link
        href="/"
        className="font-display border-3 border-black bg-rec px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide shadow-hard transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
      >
        {cta} ▸
      </Link>
    </div>
  );
}
