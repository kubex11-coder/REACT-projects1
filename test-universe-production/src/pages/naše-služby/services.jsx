import React from "react"
import "./services.css"
import PLANET from "../../images/planet-green.png"
import Foreground from "../../images/nabizime-foreground.png"
import STAR from "../../images/STAR.png"
import UFO from "../../images/UFO.png"
import Astronaut from "../../images/astronaut-main.png"
import Astronautbeer from "../../images/astr-beer.png"
import AstroDJ from "../../images/Astro-dj.png"
import Barrel1 from "../../images/barrel1.png"
import Astroletajici from "../../images/astr-letajici.png"
import { motion } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"
import { Link } from "react-router-dom"

const Services = () => {
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
                        <Link to="/onas" className="menu-link">
                            O NÁS
                        </Link>
                        <Link to="/kontakty" className="menu-link">
                            KONTAKTY
                        </Link>
                    </div>
                </div>
                <motion.div
                    className="nabizime-hero"
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
                        animate={{ scale: 1.1, opacity: 0.1, x: -800, y: 900 }}
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
                        animate={{ scale: 1.1, opacity: 0.1, x: -400, y: 800 }}
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
                        animate={{ scale: 1.1, opacity: 0.1, x: -700, y: 800 }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                        }}
                    />
                    <motion.img
                        className="star4"
                        src={STAR}
                        alt=""
                        animate={{ scale: 1.1, opacity: 0.1, x: -800, y: 900 }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                        }}
                    />
                    <motion.img
                        className="star5"
                        src={STAR}
                        alt=""
                        animate={{ scale: 1.1, opacity: 0.1, x: -900, y: 800 }}
                        transition={{
                            duration: 5,
                            delay: 4,
                            repeat: Infinity,
                        }}
                    />
                    {/* <motion.img
                        className="planetgreen"
                        src={PLANET}
                        alt=""
                        animate={{ scale: 1.1 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "mirror",
                        }}
                    /> */}

                    <motion.img
                        src={Astroletajici}
                        alt=""
                        className="astro-letajici"
                        animate={{
                            x: "1000%",
                            y: 260,
                            rotateZ: 180,
                            opacity: 0.2,
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                        }}
                    />

                    <motion.img
                        src={Foreground}
                        alt=""
                        className="nabizime-foreground"
                    />
                    <motion.img src={AstroDJ} alt="" className="astronaut-dj" />

                    <motion.img
                        src={Astronaut}
                        alt=""
                        className="astronaut"
                        id="astronaut-main1"
                    />
                    <motion.img
                        src={Barrel1}
                        alt=""
                        className="barrel barrel-2"
                    />
                    <motion.img
                        src={Astronautbeer}
                        alt=""
                        className="astronaut-beer"
                    />
                </motion.div>

                <motion.div
                    className="nabizime-logo"
                    animate={{ opacity: 0 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                >
                    <h1>Nabízíme</h1>
                </motion.div>
            </div>
            <div className="body-sekce">další sekce bitch</div>
            <div className="footer">footer bitch</div>
        </div>
    )
}

export default Services
