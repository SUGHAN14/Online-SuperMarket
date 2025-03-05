import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleLogin = () => {
    if (email) {
      setLoggedIn(true);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handlePayment = () => {
    if (paymentMethod) {
      alert(`Order placed with ${paymentMethod}`);
      setCart([]);
    }
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <div className="login-container">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button" onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          <h1>Online Supermarket</h1>
          <div className="product-list">
            {products.map(product => (
              <div key={product.id} className="brand-section">
                <h3 className="brand-name">{product.name} - {product.brand}</h3>
                <p>Price: ₹{product.price}</p>
                <button className="button" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
          
          <div className="cart-container">
            <h2>Shopping Cart</h2>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="payment-options">
            <h2>Payment Options</h2>
            <label>
              <input
                type="radio"
                value="Cash on Delivery"
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="UPI Payment"
                checked={paymentMethod === 'UPI Payment'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI Payment
            </label>
            <button className="button" onClick={handlePayment}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
