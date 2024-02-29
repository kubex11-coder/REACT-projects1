import React from "react"
import "./homepage.css"
import EARTH from "../../images/earth.png"
import Foreground from "../../images/background11.png"
// import Astronaut from "../../images/astronaut.png"
// import Astronaut2 from "../../images/astronaut1.png"
import Spaceship from "../../images/spaceship.png"
import { motion } from "framer-motion"
// import LOGO from "../../images/LOGO.png"

const Homepage = () => {
    return (
        <div className="wrapper">
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
                    animate={{ x: "560%", rotateZ: 90 }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                    }}
                />

                <motion.img src={Foreground} alt="" className="foreground" />
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
