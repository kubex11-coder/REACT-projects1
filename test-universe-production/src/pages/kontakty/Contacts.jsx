import React from "react"
import "./contacts.css"
import PLANET from "../../images/yellow-planet.png"
import Foreground from "../../images/kontakty-foreground.png"
import STAR from "../../images/STAR.png"
import Orbit from "../../images/orbit.png"
import Astronaut from "../../images/astronaut-main.png"
import Company1 from "../../images/company1.png"
import Company from "../../images/company.png"
import Budka from "../../images/astr-budka.png"
import { motion } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"
import { Link } from "react-router-dom"

const Contacts = () => {
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
                        <Link to="/onas" className="menu-link">
                            O NÁS
                        </Link>
                        {/* <Link to="/kontakty" className="menu-link">
                            KONTAKTY
                        </Link> */}
                    </div>
                </div>
                <motion.div
                    className="kontakty-hero"
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
                        className="planetyellow"
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
                        src={Orbit}
                        alt=""
                        className="orbit"
                        animate={{ x: "1000%", y: -260, rotateZ: 180 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                        }}
                    />

                    <motion.img
                        src={Foreground}
                        alt=""
                        className="kontakty-foreground"
                    />
                    <motion.img src={Company} className="company" />
                    <motion.img src={Company1} className="company1" />
                    <motion.img src={Budka} className="budka" />

                    <motion.img
                        src={Astronaut}
                        alt=""
                        className="astronaut"
                        id="astronaut-main"
                    />
                </motion.div>

                <motion.div
                    className="kontakty-logo"
                    animate={{ opacity: 0 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                >
                    <h1>Kontakty</h1>
                </motion.div>
            </div>
            <div className="body-sekce">další sekce bitch</div>
            <div className="footer">footer bitch</div>
        </div>
    )
}

export default Contacts
