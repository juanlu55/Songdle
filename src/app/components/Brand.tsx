/**
 * Identidad de Songdle: el disco ("el fragmento").
 * Un vinilo con un sexto marcado en rojo: el trozo que escuchas, uno de tus intentos.
 */

const C = 50;
const R = 48;

function point(angle: number, radius: number) {
  const t = ((angle - 90) * Math.PI) / 180;
  return [C + radius * Math.cos(t), C + radius * Math.sin(t)] as const;
}

export function wedgePath(index: number, total: number) {
  const step = 360 / total;
  const [x0, y0] = point(index * step, R);
  const [x1, y1] = point((index + 1) * step, R);
  const large = step > 180 ? 1 : 0;
  return `M50 50 L${x0.toFixed(2)} ${y0.toFixed(2)} A48 48 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

/** El sexto de la marca (de las 12 a las 2) */
const BRAND_WEDGE = wedgePath(0, 6);

type DiscTone = "default" | "inverted" | "onRec";

/**
 * El símbolo. `simple` quita surcos para tamaños pequeños (≤ 24 px).
 */
export function Disc({
  className = "",
  simple = false,
  tone = "default",
  spinning = false,
  title,
}: {
  className?: string;
  simple?: boolean;
  tone?: DiscTone;
  spinning?: boolean;
  title?: string;
}) {
  const body = tone === "inverted" ? "fill-papel" : "fill-tinta";
  const wedge = tone === "onRec" ? "fill-papel" : "fill-rec";
  const label = tone === "inverted" ? "fill-tinta" : "fill-papel";
  const hole = tone === "inverted" ? "fill-papel" : "fill-tinta";
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g className={spinning ? "disc-spin" : undefined}>
        <circle cx="50" cy="50" r="48" className={body} />
        {!simple && (
          <>
            <circle cx="50" cy="50" r="40" fill="none" stroke="#2c2925" strokeWidth="1.6" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#2c2925" strokeWidth="1.6" />
          </>
        )}
        <path d={BRAND_WEDGE} className={wedge} />
        <circle cx="50" cy="50" r={simple ? 15 : 13} className={label} />
        {!simple && <circle cx="50" cy="50" r="3.2" className={hole} />}
      </g>
    </svg>
  );
}

/** El disco dentro de la casilla con sombra dura */
export function DiscTile({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <rect x="14" y="14" width="102" height="102" className="fill-tinta" />
      <rect x="4" y="4" width="102" height="102" className="fill-white stroke-tinta" strokeWidth="6" />
      <g transform="translate(18 18) scale(0.74)">
        <circle cx="50" cy="50" r="48" className="fill-tinta" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#2c2925" strokeWidth="1.6" />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#2c2925" strokeWidth="1.6" />
        <path d={BRAND_WEDGE} className="fill-rec" />
        <circle cx="50" cy="50" r="13" className="fill-papel" />
        <circle cx="50" cy="50" r="3.2" className="fill-tinta" />
      </g>
    </svg>
  );
}

/** Logotipo: S◉NGDLE. Se lee como «Songdle» para lectores de pantalla. */
export function Wordmark({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: DiscTone;
}) {
  return (
    <span className={`wordmark inline-flex items-center whitespace-nowrap ${className}`}>
      <span className="sr-only">Songdle</span>
      <span aria-hidden="true" className="inline-flex items-center">
        S
        <Disc tone={tone} className="mx-[0.03em] h-[0.74em] w-[0.74em] flex-none" />
        NGDLE
      </span>
    </span>
  );
}

/** Versión principal: ficha + logotipo */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.28em] ${className}`}>
      <DiscTile className="h-[1.15em] w-[1.15em] flex-none" />
      <Wordmark />
    </span>
  );
}

export type SegmentFill = "acierto" | "polvo" | "oro" | "papel" | "rec" | null;

const SEGMENT_CLASS: Record<Exclude<SegmentFill, null>, string> = {
  acierto: "fill-acierto",
  polvo: "fill-polvo",
  oro: "fill-oro",
  papel: "fill-papel",
  rec: "fill-rec",
};

/**
 * El disco dividido en tantas partes como intentos.
 * Sirve como icono de modo y como resumen de la partida.
 */
export function SegmentDisc({
  segments,
  className = "",
  title,
  dividers = false,
}: {
  segments: SegmentFill[];
  className?: string;
  title?: string;
  /** Líneas de separación en papel (para iconos pequeños) */
  dividers?: boolean;
}) {
  const total = segments.length;
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <circle cx="50" cy="50" r="48" className="fill-tinta" />
      {segments.map((fill, i) =>
        fill ? (
          <path
            key={i}
            d={wedgePath(i, total)}
            className={`${SEGMENT_CLASS[fill]} stroke-tinta`}
            strokeWidth={dividers ? 0 : 2.5}
          />
        ) : null
      )}
      {dividers &&
        segments.map((_, i) => {
          const [x, y] = point((i * 360) / total, R);
          return (
            <line
              key={`l${i}`}
              x1="50"
              y1="50"
              x2={x.toFixed(2)}
              y2={y.toFixed(2)}
              className="stroke-papel"
              strokeWidth="5"
            />
          );
        })}
      <circle cx="50" cy="50" r="13" className="fill-papel stroke-tinta" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="3.2" className="fill-tinta" />
    </svg>
  );
}

/** Icono de modo: el disco con tantas partes como intentos y la primera en rojo */
export function ModeDisc({ attempts, className = "" }: { attempts: number; className?: string }) {
  const segments: SegmentFill[] = Array.from({ length: attempts }, (_, i) => (i === 0 ? "rec" : null));
  return <SegmentDisc segments={segments} dividers className={className} />;
}

/** Icono de play / pausa del reproductor */
export function PlayGlyph({ playing, className = "h-6 w-6" }: { playing: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {playing ? (
        <>
          <rect x="5" y="4" width="5" height="16" className="fill-tinta" />
          <rect x="14" y="4" width="5" height="16" className="fill-tinta" />
        </>
      ) : (
        <path d="M6 3.5 L21 12 L6 20.5 Z" className="fill-tinta" />
      )}
    </svg>
  );
}

/** Etiqueta "Reproduciendo" con el disco girando */
export function NowPlaying() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Disc spinning simple className="h-4 w-4" />
      Reproduciendo
    </span>
  );
}
