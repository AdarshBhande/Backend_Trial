// Add at the top of the file
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// --- Middleware ---
// Enable CORS for all routes
app.use(cors());
// Enable Express to parse JSON in the request body
app.use(express.json());

// --- PostgreSQL Connection ---
// Replace with your actual database credentials
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'my_business_db', 
    password: process.env.PG_PASSWORD, // Use the variable here
    port: 5432,
});
// --- API Routes (Endpoints) ---

// 1. GET all customers
app.get('/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 2. GET a single customer by ID
app.get('/customers/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL
    try {
        const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 3. POST a new customer
app.post('/customers', async (req, res) => {
    const { name, email } = req.body; // Get data from the request body
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 4. PUT (update) an existing customer
app.put('/customers/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }
    try {
        const result = await pool.query(
            'UPDATE customers SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 5. DELETE a customer
app.delete('/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});