const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory "database"
let items = [];
let currentId = 1;

// Serve Swagger JSON file
app.get('/swagger.json', (req, res) => {
    res.json(swaggerDocument);
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CRUD Endpoints

// Create an item
app.post('/api/items', (req, res) => {
    const newItem = { id: currentId++, name: req.body.name };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Read all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Read an item by ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Update an item by ID
app.put('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        item.name = req.body.name;
        res.json(item);
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Delete an item by ID
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index !== -1) {
        items.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: "Item not found" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});