import React from "react"
import "./about.css"
import PLANET from "../../images/planet-green.png"
import PLANET1 from "../../images/planet-ring.png"
import Foreground from "../../images/onas-foreground.png"
import STAR from "../../images/STAR.png"
import UFO from "../../images/UFO.png"
import Astronaut from "../../images/astronaut-main.png"
import Astr from "../../images/astr-alko.png"
import Astr1 from "../../images/astr-alko1.png"
import Astr3 from "../../images/astr-fotbalek.png"
import { motion } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"
import { Link } from "react-router-dom"

const About = () => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className="onas-wrapper">
            <div className="wrapper">
                <div className="onas-navbar">
                    <a href="#">
                        <GiHamburgerMenu
                            className={
                                isActive ? "hamburger active" : "hamburger"
                            }
                            onClick={handleClick}
                        />
                    </a>
                    <div
                        className={
                            isActive ? "menu-section active" : "menu-section"
                        }
                    >
                        <a href="#">
                            <ImCross className="cross" onClick={handleClick} />
                        </a>
                        <Link to="/" className="menu-link">
                            DOMŮ
                        </Link>
                        <Link to="/sluzby" className="menu-link">
                            NABÍZÍME
                        </Link>
                        <Link to="/foto" className="menu-link">
                            KONTAKTY
                        </Link>
                    </div>
                </div>
                <motion.div
                    className="onas-hero"
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
                    {/* <motion.img
                        className="planetgrey"
                        src={PLANET1}
                        alt=""
                        animate={{ scale: 1.1 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "mirror",
                        }}
                    /> */}
                    <motion.img
                        className="planetgreen"
                        src={PLANET}
                        alt=""
                        animate={{ scale: 1.1 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "mirror",
                        }}
                    />

                    <motion.img
                        src={UFO}
                        alt=""
                        className="ufoship"
                        animate={{ x: "1200%", y: -260, rotateZ: 20 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                        }}
                    />
                    <motion.img
                        src={UFO}
                        alt=""
                        className="ufoship1"
                        animate={{ x: "1400%", y: -260, rotateZ: 20 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                        }}
                    />

                    <motion.img
                        src={Foreground}
                        alt=""
                        className="onas-foreground"
                    />
                    <motion.img src={Astr3} className="astr astrfotbal" />

                    <motion.img src={Astr1} alt="" className="astr astr2" />
                    <motion.img src={Astronaut} alt="" className="astronaut" />
                    <motion.img src={Astr} alt="" className="astr astr1" />
                </motion.div>

                <motion.div
                    className="onas-logo"
                    animate={{ opacity: 0 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                >
                    <h1>O nás</h1>
                </motion.div>
            </div>
            <div className="body-sekce">další sekce bitch</div>
            <div className="footer">footer bitch</div>
        </div>
    )
}
export default About
