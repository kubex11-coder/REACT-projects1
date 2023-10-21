import { useContext } from "react"
import { ShopContext } from "../../context/shop-context"

const Product = (props) => {
    const { id, productName, price, productImage } = props.data
    const { addToCart } = useContext(ShopContext)
    return (
        <div key={id} className="product">
            <img src={productImage} alt={id} />
            <div className="description">
                <p>
                    <b>{productName}</b>
                </p>
                <p>{price} CZK</p>
            </div>
            <button className="addToCartBttn" onClick={() => addToCart(id)}>
                Přidat do košíku
            </button>
        </div>
    )
}

export default Product
