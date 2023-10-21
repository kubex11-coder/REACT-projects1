import React from "react"
import Navbar from "../components/navbar"
import { Outlet } from "react-router-dom"

const SharedLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default SharedLayout
