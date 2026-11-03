import { useEffect, useState } from "react"

// Dekorace po stranách hlavního banneru (jen PC, viz .hud v homepage.css):
// vlevo "terminál" s psaným kódem (weby), vpravo záznamový panel s časovačem
// a equalizerem (video). Čistě ozdoba, nic z toho není klikací.
const CODE = [
    ["const", "dev", "= {"],
    ["  role:", "\"web\","],
    ["  video:", "true,"],
    ["  coffee:", "Infinity"],
    ["}", "", ""],
]
const tones = ["hud-c1", "hud-c2", "hud-c3"]

const pad = (n) => String(n).padStart(2, "0")

const Timecode = ({ active }) => {
    const [sec, setSec] = useState(0)
    useEffect(() => {
        if (!active) return
        const id = setInterval(() => setSec((s) => (s + 1) % 3600), 1000)
        return () => clearInterval(id)
    }, [active])
    return <span className="hud-time">{`00:${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`}</span>
}

const HeroSideHud = ({ active }) => (
    <>
        <div className="hud hud-left" aria-hidden="true">
            <div className="hud-bar">
                <span /><span /><span />
                <em>kubex.dev</em>
            </div>
            <div className="hud-body">
                {CODE.map((row, i) => (
                    <div key={i} className="hud-line" style={{ "--i": i }}>
                        {row.map((word, j) => (
                            <span key={j} className={tones[j]}>{word}{" "}</span>
                        ))}
                    </div>
                ))}
                <span className="hud-caret" />
            </div>
        </div>

        <div className="hud hud-right" aria-hidden="true">
            <div className="hud-bar">
                <span className="hud-rec" />
                <em>REC</em>
                <Timecode active={active} />
            </div>
            <div className="hud-body">
                <div className="hud-eq">
                    {Array.from({ length: 14 }, (_, i) => (
                        <i key={i} style={{ "--i": i }} />
                    ))}
                </div>
                <div className="hud-meta">
                    <span>4K</span><span>24 FPS</span><span>ISO 400</span>
                </div>
            </div>
        </div>
    </>
)

export default HeroSideHud
