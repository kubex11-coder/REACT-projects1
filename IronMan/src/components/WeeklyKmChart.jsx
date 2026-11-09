import { useState } from "react";
import { useWeeklyKm } from "../plans/PlansContext";

const H = 260;
const PAD = { top: 16, right: 20, bottom: 52, left: 44 };
const STEP = 44;

function niceMax(value) {
  if (value <= 10) return 10;
  const step = value <= 50 ? 10 : 20;
  return Math.ceil(value / step) * step;
}

function fmt(n) {
  return String(Math.round(n * 10) / 10).replace(".", ",");
}

function WeeklyKmChart({ planId }) {
  const rows = useWeeklyKm(planId);
  const [hover, setHover] = useState(null);

  if (rows.length === 0) return <p className="kmchart__empty">Zatím žádné týdny.</p>;

  const W = PAD.left + PAD.right + rows.length * STEP;
  const max = niceMax(Math.max(...rows.flatMap((r) => [r.planned, r.actual])));
  const x = (i) => PAD.left + STEP / 2 + i * STEP;
  const y = (v) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
  const line = (key) => rows.map((r, i) => `${x(i)},${y(r[key])}`).join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  // Skupiny týdnů podle měsíce pro popisky osy x.
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
        <span className="kmchart__key kmchart__key--planned">Plán</span>
        <span className="kmchart__key kmchart__key--actual">Skutečnost</span>
      </div>
      <div className="kmchart__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          role="img"
          aria-label="Týdenní kilometráž: plán a skutečnost"
        >
          {ticks.map((t) => (
            <g key={t}>
              <line className="kmchart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
              <text className="kmchart__tick" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          <text className="kmchart__tick" x={4} y={10}>
            km
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
          <polyline className="kmchart__line kmchart__line--planned" points={line("planned")} />
          <polyline className="kmchart__line kmchart__line--actual" points={line("actual")} />
          {rows.map((r, i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <text className="kmchart__tick" x={x(i)} y={H - PAD.bottom + 16} textAnchor="middle">
                {r.week}
              </text>
              <circle className="kmchart__dot kmchart__dot--planned" cx={x(i)} cy={y(r.planned)} r="4" />
              <circle className="kmchart__dot kmchart__dot--actual" cx={x(i)} cy={y(r.actual)} r="4" />
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
            {h.month}, týden {h.week}
            {h.title ? ` – ${h.title}` : ""}
          </span>
          <span className="kmchart__val kmchart__val--planned">
            Plán <strong>{fmt(h.planned)} km</strong>
          </span>
          <span className="kmchart__val kmchart__val--actual">
            Skutečnost <strong>{fmt(h.actual)} km</strong>
          </span>
        </div>
      ) : (
        <p className="kmchart__info">
          Najeď na týden pro detail. Graf se aktualizuje podle zadaných km.
        </p>
      )}
    </div>
  );
}

export default WeeklyKmChart;
