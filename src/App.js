import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './Components'

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    }
    const fetchCart = async () =>{
        const response = await commerce.cart.retrieve();
        
        setCart(response)
    }
    const handelAddToCart = async ( productID, quantity ) =>{
        const { cart } = await commerce.cart.add(productID, quantity);

        setCart(cart);
    }
    const handelUpdateCartQuentity = async(productID, quantity) => {
        const { cart } = await commerce.cart.update(productID, { quantity });

        setCart(cart)
    }
    const handelRemoveFromCart = async (productID) =>{
        const { cart } = await commerce.cart.remove(productID);

        setCart(cart)
    }
    const handelEmptyCart = async() =>{
        const { cart } = await commerce.cart.empty();

        setCart( cart )
    }
    const handelCaptureChckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = commerce.checkout.capture(checkoutTokenId, newOrder)
            setOrder(incomingOrder)
            refreshCart()
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }
    const refreshCart = async () =>{
        const newCart = await commerce.cart.refresh()
        setCart(newCart)
    }
    useEffect(()=>{
        fetchProducts();
        fetchCart();
    },[])

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                <Switch >
                    <Route exact path="/" >
                        <Products products={products} onAddToCart={handelAddToCart} />
                    </Route>
                    <Route exact path="/cart" >
                        <Cart cart = {cart} handelUpdateCartQuentity={handelUpdateCartQuentity} handelRemoveFromCart={handelRemoveFromCart} handelEmptyCart={handelEmptyCart} />
                    </Route>
                    <Route exact path="/checkout" >
                        <Checkout cart={cart} order={order} onCaptureCheckout={handelCaptureChckout} error={errorMessage} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
