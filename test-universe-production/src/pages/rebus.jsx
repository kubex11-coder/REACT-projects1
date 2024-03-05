import React from "react"
import "./rebus.css"
import Planet from "../images/yellow-planet.png"
import { motion } from "framer-motion"

const Rebus = () => {
    return (
        <div className="wrapper">
            <motion.h1 className="title">Rebus</motion.h1>
            <div className="main-section">
                <div className="text-section">
                    <div className="one-info">
                        <h2>Kdy?</h2>
                        <h3>24.6.2024</h3>
                    </div>
                    <div className="one-info">
                        <h2>Kde?</h2>
                        <h3>Party Place</h3>
                    </div>
                    <div className="one-info">
                        <h2>Svoz:</h2>
                        <h3>
                            Na této adrese v tolik, návrat zpět v tolik a tolik
                        </h3>
                    </div>
                    <div className="one-info">
                        <h2>Číslo pro další detaily</h2>
                        <h3>777 777 777</h3>
                    </div>
                </div>
                <motion.img
                    className="rebus-img"
                    src={Planet}
                    alt=""
                    animate={{ rotateZ: 360 }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                />
            </div>
            <h1 className="loučení">Těšíme se na Vás</h1>
        </div>
    )
}

export default Rebus
