import Link from "next/link";

// Dot-matrix heatmap mark (from logo.svg), redrawn with a 7x7 grid of radii and greys.
const DOTS: [number, number, number, string][] = [
  [6, 6, 3.35, "#909090"], [6, 18, 4.17, "#696969"], [6, 30, 4.17, "#696969"], [6, 42, 3.35, "#909090"], [6, 54, 2.56, "#b6b6b6"], [6, 66, 2.2, "#c7c7c7"], [6, 78, 2.11, "#cbcbcb"],
  [18, 6, 4.17, "#696969"], [18, 18, 5.54, "#272727"], [18, 30, 5.54, "#272727"], [18, 42, 4.18, "#686868"], [18, 54, 2.87, "#a7a7a7"], [18, 66, 2.28, "#c3c3c3"], [18, 78, 2.13, "#cacaca"],
  [30, 6, 4.17, "#696969"], [30, 18, 5.54, "#272727"], [30, 30, 5.55, "#272727"], [30, 42, 4.23, "#666666"], [30, 54, 2.98, "#a2a2a2"], [30, 66, 2.42, "#bcbcbc"], [30, 78, 2.22, "#c6c6c6"],
  [42, 6, 3.35, "#909090"], [42, 18, 4.18, "#686868"], [42, 30, 4.24, "#666666"], [42, 42, 3.64, "#828282"], [42, 54, 3.23, "#969696"], [42, 66, 3.03, "#9f9f9f"], [42, 78, 2.63, "#b2b2b2"],
  [54, 6, 2.56, "#b6b6b6"], [54, 18, 2.87, "#a7a7a7"], [54, 30, 3.02, "#a0a0a0"], [54, 42, 3.32, "#919191"], [54, 54, 4.09, "#6c6c6c"], [54, 66, 4.37, "#5f5f5f"], [54, 78, 3.5, "#898989"],
  [66, 6, 2.2, "#c7c7c7"], [66, 18, 2.29, "#c3c3c3"], [66, 30, 2.49, "#b9b9b9"], [66, 42, 3.26, "#959595"], [66, 54, 4.65, "#525252"], [66, 66, 5.19, "#383838"], [66, 78, 4.03, "#707070"],
  [78, 6, 2.11, "#cbcbcb"], [78, 18, 2.14, "#cacaca"], [78, 30, 2.28, "#c3c3c3"], [78, 42, 2.86, "#a8a8a8"], [78, 54, 3.88, "#777777"], [78, 66, 4.27, "#646464"], [78, 78, 3.46, "#8b8b8b"],
];

/** On dark backgrounds the greys are lifted so the dense dots stay visible. */
function lift(hex: string) {
  const v = parseInt(hex.slice(1, 3), 16);
  const l = Math.round(255 - v * 0.62);
  return `rgb(${l},${l},${l})`;
}

export function LogoMark({ size = 28, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="-3 -3 90 90" aria-hidden="true">
      {DOTS.map(([cx, cy, r, fill]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={onDark ? lift(fill) : fill} />
      ))}
    </svg>
  );
}

export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="EBH Data home">
      <LogoMark onDark={onDark} />
      <span className={`text-[22px] font-bold tracking-[-0.02em] ${onDark ? "text-white" : "text-dark"}`}>EBH Data</span>
    </Link>
  );
}
