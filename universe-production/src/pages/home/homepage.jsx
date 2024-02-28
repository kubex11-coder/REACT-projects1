import React from "react"
import "./homepage.css"
import SUN from "../../images/SUN.png"
import Foreground from "../../images/foreground.png"
import Astronaut from "../../images/astronaut.png"
import Astronaut2 from "../../images/astronaut1.png"
import { motion } from "framer-motion"
import LOGO from "../../images/LOGO.png"

const Homepage = () => {
    return (
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
                className="sun"
                src={SUN}
                alt=""
                animate={{ scale: 1.2 }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            />

            <motion.img src={Foreground} alt="" className="foreground" />
            <motion.img src={Astronaut} alt="" className="astronaut" />
            <motion.img src={Astronaut2} alt="" className="astronaut1" />
            <motion.img
                className="logo"
                src={LOGO}
                alt=""
                animate={{ scale: 0.9 }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
            />
        </motion.div>
    )
}

export default Homepage
