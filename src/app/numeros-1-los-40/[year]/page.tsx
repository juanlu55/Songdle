import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NUMBER_ONE_YEARS,
  getNumberOnesByYear,
  getYearSummary,
  spotifySearchUrl,
} from "@/lib/number-ones";

export const dynamicParams = false;

export function generateStaticParams() {
  return NUMBER_ONE_YEARS.map((year) => ({ year: String(year) }));
}

type Props = { params: Promise<{ year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const summary = getYearSummary(Number(year));
  if (!summary) return {};
  const title = `Números 1 de Los 40 en ${year}: las ${summary.count} canciones`;
  const description = `Todas las canciones que fueron número 1 en Los 40 en ${year}, con su fecha: de «${summary.first.title}» a «${summary.last.title}». ¿Las reconocerías? Ponte a prueba en Songdle.`;
  return {
    title,
    description,
    alternates: { canonical: `/numeros-1-los-40/${year}` },
    openGraph: {
      title: `${title} | Songdle`,
      description,
      url: `https://songdle.es/numeros-1-los-40/${year}`,
      type: "article",
    },
  };
}

const card = "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";

export default async function NumberOnesYearPage({ params }: Props) {
  const year = Number((await params).year);
  const summary = getYearSummary(year);
  if (!summary) notFound();
  const list = getNumberOnesByYear(year);

  const index = NUMBER_ONE_YEARS.indexOf(year);
  const prevYear = NUMBER_ONE_YEARS[index - 1];
  const nextYear = NUMBER_ONE_YEARS[index + 1];
  const decade = Math.floor(year / 10) * 10;
  const decadeYears = NUMBER_ONE_YEARS.filter((y) => Math.floor(y / 10) * 10 === decade);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Números 1 de Los 40 en ${year}`,
      numberOfItems: list.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: list.map((song, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MusicRecording",
          name: song.title,
          byArtist: { "@type": "MusicGroup", name: song.artist },
          genre: song.genre,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Songdle", item: "https://songdle.es" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Números 1 de Los 40",
          item: "https://songdle.es/numeros-1-los-40",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: String(year),
          item: `https://songdle.es/numeros-1-los-40/${year}`,
        },
      ],
    },
  ];

  const topNames = summary.topArtists.map((a) => a.artist);
  const topArtistsText =
    topNames.length <= 1 ? topNames[0] ?? "" : `${topNames.slice(0, -1).join(", ")} y ${topNames[topNames.length - 1]}`;
  const topCount = summary.topArtists[0]?.count ?? 0;
  const topArtistsSentence =
    topNames.length === 0
      ? null
      : topNames.length === 1
        ? <>El artista que más veces llegó a lo más alto fue <strong>{topArtistsText}</strong>, con {topCount} números 1.</>
        : topNames.length <= 3
          ? <>Los artistas que más veces llegaron a lo más alto fueron <strong>{topArtistsText}</strong>, con {topCount} números 1 cada uno.</>
          : <>{topNames.length} artistas empataron con {topCount} números 1: <strong>{topArtistsText}</strong>.</>;

  return (
    <div className="min-h-screen bg-[#f5f1e8] py-8 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <nav aria-label="Migas de pan" className="mb-4 text-sm font-bold uppercase tracking-wide text-black/60">
            <Link href="/" className="hover:text-black transition-colors">Songdle</Link>
            <span className="mx-2">/</span>
            <Link href="/numeros-1-los-40" className="hover:text-black transition-colors">Números 1</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{year}</span>
          </nav>

          <div className="inline-block border-4 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black text-black tracking-tight">
              Números 1 de Los 40 en {year}
            </h1>
          </div>

          <p className="mt-4 text-black/80 font-medium leading-relaxed">
            En {year}, <strong>{summary.count} canciones</strong> llegaron al número 1 de Los 40.
            El año arrancó con <strong>«{summary.first.title}»</strong> de {summary.first.artist}{" "}
            ({summary.first.dateLabel}) y el último número 1 fue{" "}
            <strong>«{summary.last.title}»</strong> de {summary.last.artist} ({summary.last.dateLabel}).
            {topArtistsSentence && <> {topArtistsSentence}</>}{" "}
            El {summary.spanishShare}% de las canciones eran en español y el género más repetido fue{" "}
            {summary.topGenre.genre.toLowerCase()} ({summary.topGenre.count} de {summary.count}).
          </p>
        </header>

        <main>
          <section className={`${card} p-4 sm:p-6 mb-6`}>
            <h2 className="text-xl font-black uppercase tracking-tight mb-4 border-b-4 border-black pb-2">
              Todas las canciones número 1 de {year}
            </h2>
            <ol className="divide-y-2 divide-black/10">
              {list.map((song, i) => (
                <li key={song.id} className="flex items-center gap-3 py-3">
                  <span className="w-7 shrink-0 text-right text-sm font-black text-black/40">{i + 1}</span>
                  {song.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={song.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      decoding="async"
                      className="h-12 w-12 shrink-0 border-2 border-black object-cover bg-[#f5f1e8]"
                    />
                  ) : (
                    <span className="h-12 w-12 shrink-0 border-2 border-black bg-[#a8e6cf]" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-black leading-tight">{song.title}</p>
                    <p className="text-sm font-medium text-black/70 leading-tight">{song.artist}</p>
                    <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-black/40">
                      {song.dateLabel} · {song.genre}
                    </p>
                  </div>
                  <a
                    href={spotifySearchUrl(song)}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="shrink-0 border-2 border-black px-2 py-1 text-[10px] font-black uppercase tracking-wide hover:bg-[#a8e6cf] transition-colors"
                    aria-label={`Escuchar ${song.title} en Spotify`}
                  >
                    Spotify
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <section className={`${card} bg-[#a8e6cf] p-6 mb-6 text-center`}>
            <h2 className="text-xl font-black uppercase tracking-tight mb-2">¿Las reconocerías en 3 segundos?</h2>
            <p className="text-black/80 font-medium mb-4">
              Cada día, Songdle te pone un número 1 de Los 40. Escucha un fragmento y adivínalo en 6 intentos.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-white border-4 border-black font-black uppercase tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Jugar al Songdle de hoy
            </Link>
          </section>

          <nav aria-label="Otros años" className={`${card} p-6 mb-6`}>
            <div className="flex justify-between gap-4 mb-4 font-black uppercase text-sm">
              {prevYear ? (
                <Link href={`/numeros-1-los-40/${prevYear}`} className="underline underline-offset-4">← {prevYear}</Link>
              ) : <span />}
              {nextYear ? (
                <Link href={`/numeros-1-los-40/${nextYear}`} className="underline underline-offset-4">{nextYear} →</Link>
              ) : <span />}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-black/50 mb-2">
              Números 1 de los {String(decade).slice(2)}
            </p>
            <div className="flex flex-wrap gap-2">
              {decadeYears.map((y) => (
                <Link
                  key={y}
                  href={`/numeros-1-los-40/${y}`}
                  aria-current={y === year ? "page" : undefined}
                  className={`border-2 border-black px-3 py-1 text-sm font-black ${y === year ? "bg-black text-white" : "bg-white hover:bg-[#a8e6cf]"}`}
                >
                  {y}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium">
              <Link href="/numeros-1-los-40" className="underline font-black">Ver todos los años (1990-{NUMBER_ONE_YEARS[NUMBER_ONE_YEARS.length - 1]})</Link>
            </p>
          </nav>
        </main>

        <footer className="mt-8 text-center text-xs font-medium text-black/50">
          Fechas según las listas públicas de LOS40. Songdle no está afiliado a LOS40 ni a PRISA.
        </footer>
      </div>
    </div>
  );
}
