import { useState } from "react";
import { useWeightSeries } from "../plans/PlansContext";

const H = 260;
const PAD = { top: 16, right: 20, bottom: 52, left: 44 };
const STEP = 22;

function fmt(n) {
  return String(Math.round(n * 10) / 10).replace(".", ",");
}

// Graf ranní váhy: jedna čára, bod na každý den (blok) s vyplněnou váhou.
function WeightChart({ planId }) {
  const rows = useWeightSeries(planId);
  const [hover, setHover] = useState(null);

  const weights = rows.filter((r) => r.weight !== null).map((r) => r.weight);
  if (weights.length === 0) {
    return <p className="kmchart__empty">Zatím není zadaná žádná ranní váha.</p>;
  }

  const W = PAD.left + PAD.right + rows.length * STEP;
  const min = Math.floor(Math.min(...weights) - 1);
  const max = Math.ceil(Math.max(...weights) + 1);
  const x = (i) => PAD.left + STEP / 2 + i * STEP;
  const y = (v) => PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const points = rows
    .map((r, i) => (r.weight === null ? null : `${x(i)},${y(r.weight)}`))
    .filter(Boolean)
    .join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => min + (max - min) * t);

  // Skupiny dnů podle měsíce pro popisky osy x.
  const groups = [];
  rows.forEach((r, i) => {
    const last = groups[groups.length - 1];
    if (last && last.monthId === r.monthId) last.to = i;
    else groups.push({ monthId: r.monthId, month: r.month, from: i, to: i });
  });

  const h = hover !== null ? rows[hover] : null;

  return (
    <div className="kmchart">
      <div className="kmchart__legend">
        <span className="kmchart__key kmchart__key--actual">Ranní váha</span>
      </div>
      <div className="kmchart__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label="Ranní váha po dnech"
        >
          {ticks.map((t) => (
            <g key={t}>
              <line className="kmchart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
              <text className="kmchart__tick" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">
                {fmt(t)}
              </text>
            </g>
          ))}
          <text className="kmchart__tick" x={4} y={10}>
            kg
          </text>
          {groups.map((g) => (
            <g key={g.monthId}>
              <text
                className="kmchart__month"
                x={(x(g.from) + x(g.to)) / 2}
                y={H - 8}
                textAnchor="middle"
              >
                {g.month}
              </text>
              <line
                className="kmchart__sep"
                x1={x(g.from) - STEP / 2 + 4}
                x2={x(g.to) + STEP / 2 - 4}
                y1={H - 26}
                y2={H - 26}
              />
            </g>
          ))}
          <polyline className="kmchart__line kmchart__line--actual" points={points} />
          {rows.map((r, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {r.weight !== null && (
                <circle className="kmchart__dot kmchart__dot--actual" cx={x(i)} cy={y(r.weight)} r="4" />
              )}
              <rect
                x={x(i) - STEP / 2}
                y={PAD.top}
                width={STEP}
                height={H - PAD.top - PAD.bottom}
                fill="transparent"
              />
            </g>
          ))}
        </svg>
      </div>
      {h ? (
        <div className="kmchart__info kmchart__info--detail">
          <span className="kmchart__name">
            {h.date}, týden {h.week}
          </span>
          <span className="kmchart__val kmchart__val--actual">
            Váha <strong>{h.weight === null ? "—" : `${fmt(h.weight)} kg`}</strong>
          </span>
        </div>
      ) : (
        <p className="kmchart__info">
          Najeď na den pro detail. Graf se aktualizuje podle zadané ranní váhy.
        </p>
      )}
    </div>
  );
}

export default WeightChart;
