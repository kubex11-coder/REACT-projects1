import React from "react"
import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/home/Homepage"
import Services from "./pages/naše-služby/services"
import About from "./pages/o-nás/about"
import Kontakty from "./pages/kontakty/Contacts"
import Foto from "./pages/fotogalerie/foto"
import Test from "./pages/test"
import Rebus from "./pages/rebus"

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
                    <Route path="/test" element={<Test />} />
                    <Route path="/rebus" element={<Rebus />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
