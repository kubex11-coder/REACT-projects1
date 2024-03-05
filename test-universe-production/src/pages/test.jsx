import React, { useState } from "react"
import { motion, useAnimation } from "framer-motion"

const Test = () => {
    const [scrollY, setScrollY] = useState(0)
    const controls = useAnimation()

    // Nastavení event listeneru pro posouvání stránky
    const handleScroll = () => {
        setScrollY(window.scrollY)
    }

    // Připojení event listeneru k posouvání stránky
    React.useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })

        // Uklidíme event listener po odmontování komponentu
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Animace velikosti h1 elementu na základě aktuální hodnoty scrollY
    React.useEffect(() => {
        controls.start({ scale: 1 + scrollY / 500 })
    }, [scrollY, controls])

    const fadeInAnimationVariants = {
        initial: {
            opacity: 0,
            y: 100,
            x: 0,
        },
        animate: {
            opacity: 1,
            y: 0,
            x: 500,
            transition: {
                duration: 3,
            },
        },
    }

    return (
        <div style={{ height: "2000px" }}>
            {/* Zajišťuje, aby bylo možné posouvat stránku */}
            <motion.h1
                animate={controls}
                style={{
                    position: "fixed",
                    fontSize: "3rem",
                    textAlign: "center",
                    padding: "50px 0",
                }}
            >
                Scrolluj dolů a sleduj animaci!
            </motion.h1>
            <motion.p
                style={{
                    position: "absolute",
                    top: 1500,
                }}
                variants={fadeInAnimationVariants}
                initial="initial"
                whileInView="animate"
            >
                bla bla bla
            </motion.p>
        </div>
    )
}

export default Test
