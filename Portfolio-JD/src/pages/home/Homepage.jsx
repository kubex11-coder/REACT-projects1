import React from "react"
import "./homepage.css"
import Me from "../../images/Kyberpunková programátorská pracovna.png"
import { motion, useAnimation } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useEffect, useRef, useState } from "react"

const rand = (min, max) => min + Math.random() * (max - min)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Kód padá shora dolů jako v Matrixu: každý kus má svůj sloupec, rychlost a
// po dopadu se vrací nahoru do nového náhodného sloupce.
const FallingCode = ({ code, color }) => {
    const controls = useAnimation()

    useEffect(() => {
        let cancelled = false

        const fall = async () => {
            await sleep(rand(0, 10) * 1000)
            while (!cancelled) {
                controls.set({ x: `${rand(2, 85)}vw`, y: "-10vh", opacity: 0 })
                await controls.start({
                    y: "110vh",
                    opacity: [0, 0.35, 0.35, 0],
                    transition: {
                        duration: rand(7, 13),
                        ease: "linear",
                        times: [0, 0.12, 0.8, 1],
                    },
                })
                await sleep(rand(0, 4) * 1000)
            }
        }

        fall()
        return () => {
            cancelled = true
            controls.stop()
        }
    }, [controls])

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

const Homepage = () => {
    const [isActive, setIsActive] = useState(false)
    // -1 = levá sekce, 0 = hero, 1 = pravá sekce
    const [slide, setSlide] = useState(0)

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
                    <span className="nav-logo">WEB-DESIGNS</span>
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
                </div>

                <div className={`hero${slide === 0 ? " is-active" : ""}`} id="home">

                    {codes.map((item) => (
                        <FallingCode key={item.code} {...item} />
                    ))}

                    <h1 className="title hero-title">
                        Kubex <span className="title-accent">Designs</span>
                    </h1>

                    <motion.div
                        className="hero-photo"
                        animate={{ scale: 1.08 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "mirror",
                        }}
                    >
                        <img src={Me} alt="Jakub programuje v kyberpunkové pracovně" className="photo" />
                    </motion.div>

                </div>

                <div className={`side-section side-right${slide === 1 ? " is-active" : ""}`} aria-hidden={slide !== 1}>
                    <h2 className="title hero-title">
                        <span className="title-accent">Video</span>
                    </h2>
                </div>
                </motion.div>

                {slide !== -1 && (
                    <button
                        type="button"
                        className="arrow arrow-left"
                        aria-label={slide === 1 ? "Zpět na úvod" : "Zobrazit levou sekci"}
                        onClick={() => setSlide(slide - 1)}
                    >
                        <FiChevronLeft />
                    </button>
                )}
                {slide !== 1 && (
                    <button
                        type="button"
                        className="arrow arrow-right"
                        aria-label={slide === -1 ? "Zpět na úvod" : "Zobrazit pravou sekci"}
                        onClick={() => setSlide(slide + 1)}
                    >
                        <FiChevronRight />
                    </button>
                )}
            </div>
            <div className="body-sekce">další sekce</div>
            <div className="footer">footer</div>
        </div>
    )
}

export default Homepage
