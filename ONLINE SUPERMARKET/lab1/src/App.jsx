import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
function App() {
const [products, setProducts] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [error, setError] = useState(null);
useEffect(() => {
 const fetchProducts = async () => {
 try {
 const response = await axios.get('http://localhost:3000/products');
 console.log('Products data:', response.data);
 setProducts(response.data);
 setFilteredProducts(response.data); } catch (error) {
 console.error("There was an error fetching the products!", error);
 setError("Failed to fetch products.");
 }
 };
 fetchProducts();
}, []);
useEffect(() => {
 // Filter and sort products whenever searchTerm changes
 const filtered = products.filter(product =>
 product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 product.id.toString().includes(searchTerm)
 );
 // Sort products by price in ascending order
 const sorted = filtered.sort((a, b) => a.price - b.price);
 setFilteredProducts(sorted);
}, [searchTerm, products]);
// Group products by brand
const groupByBrand = (products) => {
 return products.reduce((acc, product) => {
 if (!acc[product.brand]) {
 acc[product.brand] = [];
 }
 acc[product.brand].push(product);
 return acc;
 }, {});
};
const productsByBrand = groupByBrand(filteredProducts);
return (
 <div className="app-container">
 <h1>Online Supermarket</h1>
 {error && <p className="error">{error}</p>}
 <input
 type="text"
 placeholder="Search by product ID or name"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="search-bar"
 />
 {Object.keys(productsByBrand).length > 0 ? (
 Object.keys(productsByBrand).map(brand => (
 <div key={brand} className="brand-section">
 <h2 className="brand-name">{brand}</h2>
 <table className="product-table">
 <thead>
 <tr>
 <th>ID</th>
 <th>Name</th>
 <th>Price</th>
 </tr>
 </thead>
 <tbody>
 {productsByBrand[brand].map(product => (
 <tr key={product._id}>
 <td>{product.id}</td>
 <td>{product.name}</td>
 <td>${product.price.toFixed(2)}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ))
 ) : (
 <p>No products found</p>
 )}
 </div>
);
}
export default App;

