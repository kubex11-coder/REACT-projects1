import Products from "../../products"
import Product from "./product"
import "./shop.css"

const shop = () => {
    return (
        <div className="shop">
            <div className="shopTitle">
                <h1>Kubex Shop</h1>
            </div>
            <div className="products">
                {Products.map((oneProduct) => {
                    return <Product data={oneProduct} />
                })}
            </div>
        </div>
    )
}

export default shop
