import React from "react"
import "./homepage.css"
import EARTH from "../../images/earth.png"
import Foreground from "../../images/background11.png"
import STAR from "../../images/STAR.png"
import Spaceship from "../../images/spaceship.png"
import { motion } from "framer-motion"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"

const Homepage = () => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className="homepage-wrapper">
            <div className="wrapper">
                <div className="navbar">
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
                        {/* <a href="/">DOMŮ</a> */}
                        <motion.a
                            href="/onas"
                            className={
                                isActive ? "menu-link active" : "menu-link"
                            }
                        >
                            O NÁS
                        </motion.a>
                        <motion.a
                            href="/sluzby"
                            className={
                                isActive ? "menu-link active" : "menu-link"
                            }
                        >
                            NABÍZÍME
                        </motion.a>
                        <motion.a
                            href="/foto"
                            className={
                                isActive ? "menu-link active" : "menu-link"
                            }
                        >
                            KONTAKTY
                        </motion.a>
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

                    <motion.img
                        src={Foreground}
                        alt=""
                        className="foreground"
                    />
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
            <div className="body-sekce">další sekce bitch</div>
            <div className="footer">footer bitch</div>
        </div>
    )
}

export default Homepage
