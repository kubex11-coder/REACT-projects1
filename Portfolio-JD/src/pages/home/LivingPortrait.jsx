import MainFx from "./MainFx"
import meta from "../../images/living/meta.json"

// Mikroanimace ilustrací: původní PNG zůstává celé jako základ a nad ním leží
// vyříznuté vrstvy (hlava, ruce, kamera), které se jen nepatrně hýbou. Vrstvy
// jsou umístěné v % původního obrázku (1536×1024), takže se všechno škáluje spolu.
// Protože pod vrstvou je pořád původní obrázek, za pohybem nevznikají mezery.
const files = require.context("../../images/living", false, /\.webp$/)
const img = (name) => files(`./${name}`)

const LivingPortrait = ({ variant, src, alt = "", className = "", animated = true }) => {
    const hidden = alt === "" ? { "aria-hidden": "true" } : {}

    // vypnuto: původní obrázek beze změny
    if (!animated) {
        return <img src={src} alt={alt} {...hidden} className={`photo ${className}`} />
    }

    return (
        <div className={`photo photo-stack ${className}`} {...hidden}>
            {/* základ bez pohyblivých částí (jinak by pod vrstvou prosvítala původní pozice) */}
            <img src={img(`${variant}-base.webp`)} alt={alt} className={`photo-stack-base lp-whole lp-whole-${variant}`} />
            <div className="layer-box">
                {variant === "main" && <MainFx />}
                {meta[variant].parts.map((p) => (
                    <div
                        key={p.name}
                        className={`lp lp-${variant}-${p.name}`}
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.width}%`,
                            height: `${p.height}%`,
                            transformOrigin: `${p.ox}% ${p.oy}%`,
                        }}
                    >
                        <img src={img(`${variant}-${p.name}.webp`)} alt="" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LivingPortrait
