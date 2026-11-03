import { useEffect, useRef } from "react"

// Vlastní kurzor pro herobannery (všechny 3 slidy): zářící jádro, prstenec, který
// za ním plynule dobíhá, a ocas z menších světélek v barvách webu. Na odkazech
// a tlačítkách se prstenec zvětší, při kliknutí se stáhne. Jen pro myš (ne dotyk).
const TRAIL = ["#c9a6ee", "#a24be0", "#6f8bff", "#ff5c8a", "#a24be0", "#c9a6ee"]
const INTERACTIVE = "a, button, [role='tab'], .arrow, .icon-control, .lang-btn"

const HeroCursor = ({ targetRef }) => {
    const coreRef = useRef(null)
    const ringRef = useRef(null)
    const trailRefs = useRef([])

    useEffect(() => {
        const target = targetRef.current
        if (!target) return
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        target.classList.add("has-fx-cursor")
        const mouse = { x: -100, y: -100 }
        const ring = { x: -100, y: -100 }
        const dots = TRAIL.map(() => ({ x: -100, y: -100 }))
        let raf = 0
        let visible = false

        const show = (v) => {
            visible = v
            const o = v ? "1" : "0"
            if (coreRef.current) coreRef.current.style.opacity = o
            if (ringRef.current) ringRef.current.style.opacity = o
            trailRefs.current.forEach((el) => el && (el.style.opacity = v ? "" : "0"))
        }

        const onMove = (e) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
            if (!visible) {
                ring.x = mouse.x
                ring.y = mouse.y
                dots.forEach((d) => {
                    d.x = mouse.x
                    d.y = mouse.y
                })
                show(true)
            }
            const hot = e.target.closest && e.target.closest(INTERACTIVE)
            ringRef.current?.classList.toggle("is-hot", !!hot)
            coreRef.current?.classList.toggle("is-hot", !!hot)
        }
        const onLeave = () => show(false)
        const onDown = () => {
            ringRef.current?.classList.add("is-down")
            coreRef.current?.classList.add("is-down")
        }
        const onUp = () => {
            ringRef.current?.classList.remove("is-down")
            coreRef.current?.classList.remove("is-down")
        }

        const tick = () => {
            ring.x += (mouse.x - ring.x) * 0.16
            ring.y += (mouse.y - ring.y) * 0.16
            if (coreRef.current) {
                coreRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
            }
            let px = mouse.x
            let py = mouse.y
            dots.forEach((d, i) => {
                d.x += (px - d.x) * (0.3 - i * 0.035)
                d.y += (py - d.y) * (0.3 - i * 0.035)
                const el = trailRefs.current[i]
                if (el) el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0)`
                px = d.x
                py = d.y
            })
            raf = requestAnimationFrame(tick)
        }

        target.addEventListener("mousemove", onMove)
        target.addEventListener("mouseleave", onLeave)
        target.addEventListener("mousedown", onDown)
        window.addEventListener("mouseup", onUp)
        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            target.classList.remove("has-fx-cursor")
            target.removeEventListener("mousemove", onMove)
            target.removeEventListener("mouseleave", onLeave)
            target.removeEventListener("mousedown", onDown)
            window.removeEventListener("mouseup", onUp)
        }
    }, [targetRef])

    return (
        <div className="fx-cursor" aria-hidden="true">
            {TRAIL.map((color, i) => (
                <span
                    key={i}
                    ref={(el) => (trailRefs.current[i] = el)}
                    className="fx-cursor-trail"
                    style={{
                        background: color,
                        boxShadow: `0 0 10px ${color}`,
                        width: 7 - i * 0.9,
                        height: 7 - i * 0.9,
                        opacity: 0,
                    }}
                />
            ))}
            <span ref={ringRef} className="fx-cursor-ring" style={{ opacity: 0 }} />
            <span ref={coreRef} className="fx-cursor-core" style={{ opacity: 0 }} />
        </div>
    )
}

export default HeroCursor
