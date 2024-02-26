import React from "react"
import "./homepage.css"
import SUN from "../../images/SUN.png"
import { motion } from "framer-motion"
import Planet1 from "../../images/planet1.png"

const homepage = () => {
    return (
        <div className="homepage">
            <div className="logo-section">Logo</div>
            <motion.div
                className="sun"
                animate={{ scale: 2.1 }}
                transition={{ duration: 30 }}
            >
                <img src={SUN} alt="" />
            </motion.div>
            <motion.div className="planet1">
                <img src={Planet1} alt="" />
            </motion.div>
            <div className="cosmonaut">cosmonaut</div>
        </div>
    )
}

export default homepage
