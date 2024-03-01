import React from "react"
import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Homepage"
import Services from "./pages/naše-služby/Services"
import About from "./pages/o-nás/About"
import Kontakty from "./pages/kontakty/Contacts"
import Foto from "./pages/fotogalerie/Foto"

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/onas" element={<About />} />
                    <Route path="/sluzby" element={<Services />} />
                    <Route path="/kontakty" element={<Kontakty />} />
                    <Route path="/foto" element={<Foto />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
