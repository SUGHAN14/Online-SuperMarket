const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const app = express();
const port = 3000;
// Use CORS middleware
app.use(cors()); // This will allow all origins by default
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/online_supermarket', {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.error(err));
// Define product schema
const productSchema = new mongoose.Schema({
 id: Number,
 name: String,
 brand: String,
 price: Number
});
const Product = mongoose.model('Product', productSchema);

// API endpoints
app.get('/products', async (req, res) => {
 try {
 const products = await Product.find();
 res.json(products);
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});
app.get('/products/:id', async (req, res) => {
 try {
 const product = await Product.findById(req.params.id);
 if (product == null) {
 return res.status(404).json({ message: 'Product not found' });
 }
 res.json(product);
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});
app.listen(port, () => {
 console.log(`Server listening on port ${port}`);
});