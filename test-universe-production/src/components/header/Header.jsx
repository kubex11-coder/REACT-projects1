import React from "react"
import "./header.css"
import { GiHamburgerMenu } from "react-icons/gi"
import { ImCross } from "react-icons/im"
import { useState } from "react"

const Header = () => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className="navbar">
            <a href="#">
                <GiHamburgerMenu className="hamburger" onClick={handleClick} />
            </a>
            <div className={isActive ? "menu-section active" : "menu-section"}>
                <a href="#">
                    <ImCross className="hamburger" onClick={handleClick} />
                </a>
                <a href="#">O NÁS</a>
                <a href="#">NABÍZÍME</a>
                <a href="#">KONTAKTY</a>
            </div>
        </div>
    )
}

export default Header
