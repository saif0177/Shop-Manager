// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Sample data - in a real app, this would be stored in a database
let products = [
    {
        id: 1,
        name: 'Black T-Shirt',
        category: 't-shirts',
        price: 19.99,
        originalPrice: 24.99,
        discount: 20,
        stock: 45,
        rating: 4.5,
        ratingCount: 128,
        image: 'demo-tshirt.jpg',
        description: 'Premium cotton black t-shirt for everyday wear.'
    },
    {
        id: 2,
        name: 'Blue Denim Jeans',
        category: 'pants',
        price: 49.99,
        originalPrice: 59.99,
        discount: 17,
        stock: 32,
        rating: 4.8,
        ratingCount: 95,
        image: 'demo-jeans.jpg',
        description: 'Classic blue denim jeans with a comfortable fit.'
    },
    {
        id: 3,
        name: 'White Dress Shirt',
        category: 'shirts',
        price: 34.99,
        originalPrice: 34.99,
        discount: 0,
        stock: 18,
        rating: 4.2,
        ratingCount: 67,
        image: 'demo-shirt.jpg',
        description: 'Elegant white dress shirt for formal occasions.'
    }
];

let orders = [
    {
        id: 'ORD-2023-001',
        customer: 'John Doe',
        email: 'john.doe@example.com',
        date: '2023-06-15T10:30:00',
        amount: 128.97,
        status: 'completed',
        items: [
            { name: 'Black T-Shirt', quantity: 2, price: 19.99 },
            { name: 'Blue Denim Jeans', quantity: 1, price: 49.99 },
            { name: 'Running Shoes', quantity: 1, price: 79.99 }
        ]
    },
    {
        id: 'ORD-2023-002',
        customer: 'Jane Smith',
        email: 'jane.smith@example.com',
        date: '2023-06-14T14:45:00',
        amount: 64.98,
        status: 'completed',
        items: [
            { name: 'White Dress Shirt', quantity: 1, price: 34.99 },
            { name: 'Striped Polo Shirt', quantity: 1, price: 29.99 }
        ]
    }
];

let notes = [
    {
        id: 1,
        title: 'Order New Inventory',
        content: 'Need to order more T-shirts in size M and L. Current stock is running low.',
        date: '2023-06-14T09:30:00'
    },
    {
        id: 2,
        title: 'Summer Sale Planning',
        content: 'Start preparing for summer sale. Need to decide on discount percentages and which products to include.',
        date: '2023-06-13T14:45:00'
    }
];

// API Routes

// Products API
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // If discount is applied, calculate original price
    if (newProduct.discount > 0) {
        newProduct.originalPrice = parseFloat((newProduct.price / (1 - newProduct.discount / 100)).toFixed(2));
    } else {
        newProduct.originalPrice = newProduct.price;
    }
    
    // Set default values for new products
    newProduct.rating = newProduct.rating || 0;
    newProduct.ratingCount = newProduct.ratingCount || 0;
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        // If discount is applied, calculate original price
        if (updatedProduct.discount > 0) {
            updatedProduct.originalPrice = parseFloat((updatedProduct.price / (1 - updatedProduct.discount / 100)).toFixed(2));
        } else {
            updatedProduct.originalPrice = updatedProduct.price;
        }
        
        // Keep the ID and any other fields that shouldn't be changed directly
        updatedProduct.id = id;
        updatedProduct.rating = products[index].rating;
        updatedProduct.ratingCount = products[index].ratingCount;
        
        products[index] = updatedProduct;
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        res.json(deletedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Orders API
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
    const id = req.params.id;
    const order = orders.find(o => o.id === id);
    
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.post('/api/orders', (req, res) => {
    const newOrder = req.body;
    
    // Generate order ID
    const orderCount = orders.length + 1;
    const orderDate = new Date();
    const year = orderDate.getFullYear();
    newOrder.id = `ORD-${year}-${orderCount.toString().padStart(3, '0')}`;
    
    // Set date if not provided
    newOrder.date = newOrder.date || new Date().toISOString();
    
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
    const id = req.params.id;
    const updatedOrder = req.body;
    const index = orders.findIndex(o => o.id === id);
    
    if (index !== -1) {
        // Keep the ID
        updatedOrder.id = id;
        
        orders[index] = updatedOrder;
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Notes API
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const note = notes.find(n => n.id === id);
    
    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
    
    // Set date if not provided
    newNote.date = newNote.date || new Date().toISOString();
    
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedNote = req.body;
    const index = notes.findIndex(n => n.id === id);
    
    if (index !== -1) {
        // Keep the ID
        updatedNote.id = id;
        
        notes[index] = updatedNote;
        res.json(updatedNote);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    
    if (index !== -1) {
        const deletedNote = notes.splice(index, 1)[0];
        res.json(deletedNote);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Serve the main HTML file for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 