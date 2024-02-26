import React from "react"
import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home/homepage"
import Services from "./pages/naše-služby/services"
import About from "./pages/o-nás/about"
import Foto from "./pages/fotogalerie/foto"
import SharedLayout from "./pages/sharedLayout/sharedLayout"

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SharedLayout />}>
                        <Route index element={<Home />} />
                        <Route path="/onas" element={<About />} />
                        <Route path="sluzby" element={<Services />} />
                        <Route path="/foto" element={<Foto />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
