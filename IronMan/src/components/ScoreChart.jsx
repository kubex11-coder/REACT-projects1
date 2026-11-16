import { useScore } from "../plans/PlansContext";
import { scoreTier } from "./scoreTier";

const W = 480;
const H = 260;
const PAD = { top: 28, right: 20, bottom: 34, left: 44 };
const BAR = 64;
const TICKS = [0, 25, 50, 75, 100];

// Sloupcový graf skóre plnění všech sekcí v %.
function ScoreChart() {
  const sections = [
    { label: "RUN", ...useScore("run") },
    { label: "SWIM", ...useScore("swim") },
    { label: "FITKO", ...useScore("fitko") },
    { label: "FOOD", ...useScore("food") },
  ];

  const y = (v) => PAD.top + (1 - v / 100) * (H - PAD.top - PAD.bottom);
  const slot = (W - PAD.left - PAD.right) / sections.length;

  return (
    <div className="kmchart">
      <div className="kmchart__scroll">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ maxWidth: W }}
          role="img"
          aria-label="Skóre plnění jednotlivých sekcí"
        >
          {TICKS.map((t) => (
            <g key={t}>
              <line className="kmchart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
              <text className="kmchart__tick" x={PAD.left - 8} y={y(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          <text className="kmchart__tick" x={4} y={14}>
            %
          </text>
          {sections.map((s, i) => {
            const cx = PAD.left + slot * (i + 0.5);
            const tier = scoreTier(s.percent, s.answered);
            return (
              <g key={s.label}>
                {s.answered > 0 && (
                  <rect
                    className={`kmchart__bar kmchart__bar--${tier}`}
                    x={cx - BAR / 2}
                    y={y(s.percent)}
                    width={BAR}
                    height={y(0) - y(s.percent)}
                    rx="4"
                  />
                )}
                <text
                  className="kmchart__bar-value"
                  x={cx}
                  y={s.answered > 0 ? y(s.percent) - 8 : y(0) - 8}
                  textAnchor="middle"
                >
                  {s.answered > 0 ? `${s.percent} %` : "—"}
                </text>
                <text className="kmchart__month" x={cx} y={H - 10} textAnchor="middle">
                  {s.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="kmchart__info">
        Sekce bez jediné odpovědi nemá sloupec. Graf se aktualizuje podle zaškrtnutých bloků.
      </p>
    </div>
  );
}

export default ScoreChart;
