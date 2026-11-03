import React from "react"
import "./homepage.css"
import Me from "../../images/Herobanner-main.png"
import WebPhoto from "../../images/Herobanner-web.png"
import VideoPhoto from "../../images/Herobanner-video.png"
import DroneImg from "../../images/Drone.png"
import { motion, useAnimation } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useEffect, useRef, useState } from "react"

const rand = (min, max) => min + Math.random() * (max - min)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Kód padá shora dolů jako v Matrixu. Šířka je rozdělená na stejně široké
// sloupce a každý kus má v každém okamžiku jiný sloupec, takže jsou obsazené
// rovnoměrně celé osy x. Po dopadu se kus vrací do jiného sloupce (krok 3 je
// nesoudělný s 10, takže projde všechny).
const LANES = 10
const LANE_START = 2
const LANE_WIDTH = 88 / LANES
const LANE_STEP = 3

const FallingCode = ({ code, color, index }) => {
    const controls = useAnimation()

    useEffect(() => {
        let cancelled = false

        const fall = async () => {
            // kusy startují rovnoměrně rozložené v čase
            await sleep(index * 900)
            let cycle = 0
            while (!cancelled) {
                const lane = (index * LANE_STEP + cycle * LANE_STEP) % LANES
                const x = LANE_START + lane * LANE_WIDTH + rand(0, LANE_WIDTH * 0.4)
                cycle += 1
                controls.set({ x: `${x}vw`, y: "-10vh", opacity: 0 })
                await controls.start({
                    y: "110vh",
                    opacity: [0, 0.35, 0.35, 0],
                    transition: {
                        duration: rand(7, 13),
                        ease: "linear",
                        times: [0, 0.12, 0.8, 1],
                    },
                })
                await sleep(rand(0, 2) * 1000)
            }
        }

        fall()
        return () => {
            cancelled = true
            controls.stop()
        }
    }, [controls, index])

    return (
        <motion.div
            className="flying-code"
            initial={{ x: "0vw", y: "-10vh", opacity: 0 }}
            animate={controls}
        >
            <span className="code-snippet" style={{ color }}>
                {code}
            </span>
        </motion.div>
    )
}

// Dron přeletí zpoza levého okraje za pravý, po 1 s pauze znovu z jiné výšky.
// Létá jen dokud je video slide na scéně.
const Drone = ({ active }) => {
    const controls = useAnimation()
    const [top, setTop] = useState(25)

    useEffect(() => {
        if (!active) return
        let cancelled = false

        const fly = async () => {
            while (!cancelled) {
                // šikmý let po sinusoidě: lineární sklon z y0 do y1 + vlna;
                // dron zůstává vodorovně (bez naklánění)
                const y0 = rand(-12, 12)
                const y1 = rand(-12, 12) + (y0 > 0 ? -12 : 12)
                const amp = rand(7, 11) // vh
                const waves = rand(1.5, 2.5)
                const phase = rand(0, Math.PI * 2)
                const duration = rand(8, 12)

                const steps = 24
                const times = []
                const ys = []
                const yAt = (t) => y0 + (y1 - y0) * t + amp * Math.sin(phase + waves * 2 * Math.PI * t)
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps
                    times.push(t)
                    ys.push(`${yAt(t)}vh`)
                }

                setTop(rand(30, 45))
                controls.set({ x: "-30vw", y: ys[0] })
                await controls.start({
                    x: "130vw",
                    y: ys,
                    transition: {
                        x: { duration, ease: "linear" },
                        y: { duration, ease: "linear", times },
                    },
                })
                await sleep(1000)
            }
        }

        fly()
        return () => {
            cancelled = true
            controls.stop()
        }
    }, [active, controls])

    return (
        <div className="drone-layer" aria-hidden="true">
            <motion.div
                className="drone"
                style={{ top: `${top}%` }}
                initial={{ x: "-30vw" }}
                animate={controls}
            >
                <img src={DroneImg} alt="" className="drone-img" />
            </motion.div>
        </div>
    )
}

// Vznášející se okno prohlížeče s "psaným" kódem na slidu Weby
const BrowserWindow = () => (
    <motion.div
        className="browser-window"
        aria-hidden="true"
        animate={{ y: [0, -14, 0], rotate: [-2, 1.5, -2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
        <div className="bw-bar">
            <span className="bw-dot" />
            <span className="bw-dot" />
            <span className="bw-dot" />
            <span className="bw-url" />
        </div>
        <div className="bw-body">
            <span className="bw-line bw-line-1" />
            <span className="bw-line bw-line-2" />
            <span className="bw-line bw-line-3" />
            <span className="bw-line bw-line-4" />
            <span className="bw-block" />
        </div>
    </motion.div>
)

const codes = [
    { code: "<div/>", color: "#c9a6ee" },
    { code: "<br>", color: "#a24be0" },
    { code: "const () =>", color: "#ff5c8a" },
    { code: "</>", color: "#a24be0" },
    { code: "useState()", color: "#c9a6ee" },
    { code: "{ }", color: "#6f8bff" },
    { code: "return (", color: "#ff5c8a" },
    { code: "npm start", color: "#a24be0" },
    { code: "<p>", color: "#6f8bff" },
    { code: "=> {}", color: "#c9a6ee" },
]

const SLIDE_NAMES = { "-1": "Weby a aplikace", 1: "Video tvorba" }
// krátké názvy pro svislé jazýčky na mobilu
const SLIDE_SHORT = { "-1": "WEBY", 1: "VIDEA" }

const Homepage = () => {
    const [isActive, setIsActive] = useState(false)
    // -1 = levá sekce, 0 = hero, 1 = pravá sekce
    const [slide, setSlide] = useState(0)

    // nápověda ke swipu: zmizí po prvním přepnutí nebo po 8 s
    const [showHint, setShowHint] = useState(true)

    useEffect(() => {
        if (slide !== 0) setShowHint(false)
    }, [slide])

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 8000)
        return () => clearTimeout(timer)
    }, [])

    // swajp prstem: doleva = další slide (vpravo), doprava = předchozí (vlevo)
    const touchStart = useRef(null)

    const handleTouchStart = (e) => {
        const t = e.touches[0]
        touchStart.current = { x: t.clientX, y: t.clientY }
    }

    const handleTouchEnd = (e) => {
        if (!touchStart.current) return
        const t = e.changedTouches[0]
        const dx = t.clientX - touchStart.current.x
        const dy = t.clientY - touchStart.current.y
        touchStart.current = null
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
        setSlide((s) => Math.max(-1, Math.min(1, s + (dx < 0 ? 1 : -1))))
    }

    // z úvodu se jde do obou sekcí, z bočních sekcí jen zpět na úvod
    const targets = (slide === 0 ? [-1, 1] : [0]).map((target) => ({
        target,
        dir: target > slide ? "right" : "left",
    }))

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className="homepage-wrapper">
            <div
                className="wrapper"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="navbar">
                    {/* vždy znovu načte úvodní stránku, i když na ní uživatel už je */}
                    <a
                        href="/"
                        className="nav-logo"
                        onClick={(e) => {
                            e.preventDefault()
                            window.location.href = "/"
                        }}
                    >
                        K<span className="title-accent">X</span>D
                    </a>
                    <button
                        type="button"
                        className="icon-control"
                        aria-label="Open menu"
                        onClick={handleClick}
                    >
                        <GiHamburgerMenu
                            className={
                                isActive ? "hamburger active" : "hamburger"
                            }
                        />
                    </button>
                    <div
                        className={
                            isActive ? "menu-section active" : "menu-section"
                        }
                    >
                        <button
                            type="button"
                            className="icon-control close-btn"
                            aria-label="Close menu"
                            onClick={handleClick}
                        >
                            <ImCross className="cross" />
                        </button>

                        <a href="#home" className="menu-link current">
                            Domů
                        </a>
                        <a href="#o-nas" className="menu-link">
                            O mně
                        </a>
                        <a href="#portfolio" className="menu-link">
                            Portfolio
                        </a>
                        <a href="#kontakty" className="menu-link">
                            Kontakt
                        </a>
                    </div>
                </div>

                <motion.div
                    className="hero-track"
                    initial={false}
                    animate={{ rotate: slide * 60, x: 0, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                >
                <div className={`side-section side-left${slide === -1 ? " is-active" : ""}`} aria-hidden={slide !== -1}>
                    <h2 className="title hero-title">
                        <span className="title-accent">Weby</span>
                    </h2>
                    <BrowserWindow />
                    {/* fotka je v kuželu světla vpravo, text vlevo */}
                    <div className="side-photo side-photo-right">
                        <img src={WebPhoto} alt="" aria-hidden="true" className="photo photo-flip" />
                    </div>
                    <div className="side-text side-text-left">
                        <h2 className="side-heading">Lorem ipsum dolor</h2>
                        <p className="side-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </p>
                        <button type="button" className="side-btn">Zjistit více</button>
                    </div>
                    <div className="spotlight spotlight-right" aria-hidden="true">
                        <span className="spot-beam" />
                        <span className="spot-lamp" />
                    </div>
                </div>

                <div className={`hero${slide === 0 ? " is-active" : ""}`} id="home">

                    {/* paprsky těchto lamp jsou ve vrstvě .light-overlay níže (nad tlačítky) */}
                    <div className="spotlight spotlight-left" aria-hidden="true">
                        <span className="spot-lamp" />
                    </div>
                    <div className="spotlight spotlight-right" aria-hidden="true">
                        <span className="spot-lamp" />
                    </div>

                    {codes.map((item, i) => (
                        <FallingCode key={item.code} index={i} {...item} />
                    ))}

                    <h1 className="title hero-title">
                        Kubex <span className="title-accent">Designs</span>
                    </h1>
                    <h2 className="hero-subtitle">Tvořím weby, aplikace a videa</h2>

                    <motion.div
                        className="hero-photo"
                        animate={{ scale: 1.03 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "mirror",
                        }}
                    >
                        {/* tmavá silueta pod fotkou: zakryje padající kód všude, kde je postava */}
                        <img src={Me} alt="" aria-hidden="true" className="photo photo-silhouette" />
                        <img src={Me} alt="Jakub programuje v kyberpunkové pracovně" className="photo" />
                    </motion.div>

                </div>

                <div className={`side-section side-right${slide === 1 ? " is-active" : ""}`} aria-hidden={slide !== 1}>
                    <h2 className="title hero-title">
                        <span className="title-accent">Video</span>
                    </h2>
                    <Drone active={slide === 1} />
                    {/* fotka je v kuželu světla vlevo, text vpravo */}
                    <div className="side-photo side-photo-left">
                        <img src={VideoPhoto} alt="" aria-hidden="true" className="photo" />
                    </div>
                    <div className="side-text side-text-right">
                        <h2 className="side-heading">Lorem ipsum dolor</h2>
                        <p className="side-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                        </p>
                        <button type="button" className="side-btn">Zjistit více</button>
                    </div>
                    <div className="spotlight spotlight-left" aria-hidden="true">
                        <span className="spot-beam" />
                        <span className="spot-lamp" />
                    </div>
                </div>
                </motion.div>

                <div className={`light-overlay${slide === 0 ? " is-on" : ""}`} aria-hidden="true">
                    <div className="spotlight spotlight-left">
                        <span className="spot-beam" />
                    </div>
                    <div className="spotlight spotlight-right">
                        <span className="spot-beam" />
                    </div>
                </div>

                {targets.map(({ target, dir }) => (
                    <button
                        key={target}
                        type="button"
                        className={`arrow arrow-${dir}${slide === 0 ? " arrow-hero" : ""}`}
                        aria-label={target === 0 ? "Zpět na úvod" : SLIDE_NAMES[target]}
                        onClick={() => setSlide(target)}
                    >
                        <span className="arrow-label">
                            <span className="arrow-full">{target === 0 ? "Zpět" : SLIDE_NAMES[target]}</span>
                            <span className="arrow-short" aria-hidden="true">{target === 0 ? "ZPĚT" : SLIDE_SHORT[target]}</span>
                        </span>
                    </button>
                ))}

                {showHint && slide === 0 && (
                    <div className="swipe-hint" aria-hidden="true">
                        <span className="hint-chev hint-chev-left">‹</span>
                        <span>Přejeď prstem</span>
                        <span className="hint-chev hint-chev-right">›</span>
                    </div>
                )}

                <div className="slide-dots" role="tablist" aria-label="Přepínání bannerů">
                    {[-1, 0, 1].map((i) => (
                        <button
                            key={i}
                            type="button"
                            role="tab"
                            aria-selected={slide === i}
                            aria-label={i === -1 ? "Weby a aplikace" : i === 0 ? "Úvod" : "Video tvorba"}
                            className={`slide-dot${slide === i ? " is-active" : ""}`}
                            onClick={() => setSlide(i)}
                        />
                    ))}
                </div>
            </div>
            <div className="body-sekce" id="o-nas">další sekce</div>
            <div className="footer">footer</div>
        </div>
    )
}

export default Homepage
