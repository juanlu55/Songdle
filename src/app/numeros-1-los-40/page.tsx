import Link from "next/link";
import type { Metadata } from "next";
import { NUMBER_ONE_YEARS, getYearSummary } from "@/lib/number-ones";

const firstYear = NUMBER_ONE_YEARS[0];
const lastYear = NUMBER_ONE_YEARS[NUMBER_ONE_YEARS.length - 1];
const summaries = NUMBER_ONE_YEARS.map((y) => getYearSummary(y)!);
const total = summaries.reduce((sum, s) => sum + s.count, 0);

export const metadata: Metadata = {
  title: `Números 1 de Los 40 por año (${firstYear}-${lastYear})`,
  description: `Las ${total.toLocaleString("es-ES")} canciones que fueron número 1 en Los 40 desde ${firstYear}, año por año y con su fecha. Repasa los éxitos de los 90, 2000, 2010 y 2020.`,
  alternates: { canonical: "/numeros-1-los-40" },
  openGraph: {
    title: `Números 1 de Los 40 por año (${firstYear}-${lastYear}) | Songdle`,
    description: `Todas las canciones número 1 de Los 40 desde ${firstYear}, año por año.`,
    url: "https://songdle.es/numeros-1-los-40",
    type: "website",
  },
};

const decades = [...new Set(NUMBER_ONE_YEARS.map((y) => Math.floor(y / 10) * 10))];

export default function NumberOnesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Números 1 de Los 40 por año (${firstYear}-${lastYear})`,
    url: "https://songdle.es/numeros-1-los-40",
    inLanguage: "es-ES",
    hasPart: NUMBER_ONE_YEARS.map((y) => ({
      "@type": "WebPage",
      name: `Números 1 de Los 40 en ${y}`,
      url: `https://songdle.es/numeros-1-los-40/${y}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-black/60 hover:text-black transition-colors mb-4"
          >
            ← Jugar ahora
          </Link>
          <div className="inline-block border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-black tracking-tight">Números 1 de Los 40 por año</h1>
          </div>
          <p className="mt-4 text-black/80 font-medium leading-relaxed">
            Desde {firstYear}, <strong>{total.toLocaleString("es-ES")} canciones</strong> han llegado al número 1
            de Los 40. Elige un año para ver todas sus canciones número 1, con la fecha en que alcanzaron lo más alto.
            Todas forman parte del catálogo de Songdle, el juego diario de adivinar la canción.
          </p>
        </header>

        <main className="space-y-6">
          {decades.map((decade) => (
            <section
              key={decade}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
            >
              <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
                Números 1 de los {String(decade).slice(2)}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summaries
                  .filter((s) => Math.floor(s.year / 10) * 10 === decade)
                  .map((s) => (
                    <li key={s.year}>
                      <Link
                        href={`/numeros-1-los-40/${s.year}`}
                        className="block border-2 border-black p-3 bg-[#f5f1e8] hover:bg-[#a8e6cf] transition-colors h-full"
                      >
                        <span className="flex items-baseline justify-between">
                          <span className="text-lg font-black">{s.year}</span>
                          <span className="text-xs font-bold uppercase text-black/50">{s.count} números 1</span>
                        </span>
                        <span className="block mt-1 text-sm font-medium text-black/70 truncate">
                          «{s.first.title}» · {s.first.artist}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}

          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#a8e6cf] border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Jugar al Songdle de hoy
            </Link>
          </div>
        </main>

        <footer className="mt-8 text-center text-xs font-medium text-black/50">
          Fechas según las listas públicas de LOS40. Songdle no está afiliado a LOS40 ni a PRISA.
        </footer>
      </div>
    </div>
  );
}
