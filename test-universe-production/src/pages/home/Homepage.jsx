import React from "react"
import "./homepage.css"
import EARTH from "../../images/earth.png"
import Foreground from "../../images/background11.png"
import STAR from "../../images/STAR.png"
// import Astronaut from "../../images/astronaut.png"
// import Astronaut2 from "../../images/astronaut1.png"
import Spaceship from "../../images/spaceship.png"
import Bucanero from "../../images/bucanero.png"
import { motion } from "framer-motion"
// import LOGO from "../../images/LOGO.png"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"

const Homepage = () => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className="wrapper">
            <div className="navbar">
                <a href="#">
                    <GiHamburgerMenu
                        className={isActive ? "hamburger active" : "hamburger"}
                        onClick={handleClick}
                    />
                </a>
                <div
                    className={
                        isActive ? "menu-section active" : "menu-section"
                    }
                >
                    <a href="#">
                        <ImCross className="hamburger" onClick={handleClick} />
                    </a>
                    <a href="/">DOMŮ</a>
                    <a href="/onas">O NÁS</a>
                    <a href="/sluzby">NABÍZÍME</a>
                    <a href="/foto">KONTAKTY</a>
                </div>
            </div>
            <motion.div
                className="homepage"
                animate={{
                    scale: 1.2,
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            >
                <motion.img
                    className="star1"
                    src={STAR}
                    alt=""
                    animate={{ scale: 1.1, opacity: 0.1, x: 800, y: 500 }}
                    transition={{
                        duration: 5,
                        delay: 2,
                        repeat: Infinity,
                    }}
                />
                <motion.img
                    className="star2"
                    src={STAR}
                    alt=""
                    animate={{ scale: 1.1, opacity: 0.1, x: 300, y: 500 }}
                    transition={{
                        duration: 5,
                        delay: 3,
                        repeat: Infinity,
                    }}
                />
                <motion.img
                    className="star3"
                    src={STAR}
                    alt=""
                    animate={{ scale: 1.1, opacity: 0.1, x: 500, y: 500 }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                />
                <motion.img
                    className="star4"
                    src={STAR}
                    alt=""
                    animate={{ scale: 1.1, opacity: 0.1, x: 700, y: 500 }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                    }}
                />
                <motion.img
                    className="star5"
                    src={STAR}
                    alt=""
                    animate={{ scale: 1.1, opacity: 0.1, x: 100, y: 500 }}
                    transition={{
                        duration: 5,
                        delay: 4,
                        repeat: Infinity,
                    }}
                />
                <motion.img
                    className="earth"
                    src={EARTH}
                    alt=""
                    animate={{ scale: 1.2 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                />
                <motion.img
                    src={Spaceship}
                    alt=""
                    className="spaceship"
                    animate={{ x: "560%", rotateZ: 120 }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                    }}
                />

                <motion.img src={Foreground} alt="" className="foreground" />
                {/* <motion.img
                    src={Bucanero}
                    alt=""
                    className="bucanero"
                    animate={{ opacity: 0 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                /> */}
            </motion.div>

            <motion.div
                className="logo"
                animate={{ opacity: 0 }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            >
                <h1>
                    Universe <br></br> Production
                </h1>
            </motion.div>
        </div>
    )
}

export default Homepage
