const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/online_supermarket', {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
 .then(() => console.log('MongoDB connected'))
 .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
 email: String,
 cart: [{ id: Number, name: String, brand: String, price: Number }],
 paymentMethod: String
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
 id: Number,
 name: String,
 brand: String,
 price: Number
});
const Product = mongoose.model('Product', productSchema);

// User Login or Register
app.post('/login', async (req, res) => {
 try {
 const { email } = req.body;
 let user = await User.findOne({ email });
 if (!user) {
 user = new User({ email, cart: [], paymentMethod: '' });
 await user.save();
 }
 const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
 res.json({ token });
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
 const token = req.headers['authorization'];
 if (!token) return res.status(401).json({ message: 'Access Denied' });
 try {
 const verified = jwt.verify(token, SECRET_KEY);
 req.user = verified;
 next();
 } catch (err) {
 res.status(400).json({ message: 'Invalid Token' });
 }
};

// Get user cart
app.get('/cart', authenticate, async (req, res) => {
 try {
 const user = await User.findOne({ email: req.user.email });
 res.json(user.cart);
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});

// Add item to cart
app.post('/cart', authenticate, async (req, res) => {
 try {
 const { id, name, brand, price } = req.body;
 const user = await User.findOne({ email: req.user.email });
 user.cart.push({ id, name, brand, price });
 await user.save();
 res.json(user.cart);
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});

// Remove item from cart
app.delete('/cart/:id', authenticate, async (req, res) => {
 try {
 const user = await User.findOne({ email: req.user.email });
 user.cart = user.cart.filter(item => item.id !== parseInt(req.params.id));
 await user.save();
 res.json(user.cart);
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});

// Set Payment Method
app.post('/payment', authenticate, async (req, res) => {
 try {
 const { paymentMethod } = req.body;
 const user = await User.findOne({ email: req.user.email });
 user.paymentMethod = paymentMethod;
 await user.save();
 res.json({ message: 'Payment method updated' });
 } catch (err) {
 res.status(500).json({ message: err.message });
 }
});

app.listen(port, () => {
 console.log(`Server listening on port ${port}`);
});
