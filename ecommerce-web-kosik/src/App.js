import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SharedLayout from "./pages/SharedLayout"
import Shop from "./pages/shop/shop"
import Cart from "./pages/cart/cart"
import ShopContextProvider from "./context/shop-context"

const App = () => {
    return (
        <div>
            <ShopContextProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<SharedLayout />}>
                            <Route path="/" element={<Shop />} />
                            <Route path="/cart" element={<Cart />} />
                        </Route>
                    </Routes>
                </Router>
            </ShopContextProvider>
        </div>
    )
}

export default App
