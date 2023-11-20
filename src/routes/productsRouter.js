import express from 'express';
import Products from '../models/productSchema.js';
import { getIo } from '../config/socketIo.js';

const productRouter = express.Router();

/**
 * Get a limited number of products.
 */
productRouter.get('/', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit);
        if (isNaN(limit)) {
            limit = await Products.countDocuments();
        }
        if (limit <= 0) {
            return res.status(400).json({ message: 'Limit must be a positive number' });
        }
        const totalProducts = await Products.countDocuments();
        if (limit > totalProducts) {
            return res.status(400).json({ message: 'Limit exceeds the number of products' });
        }
        const products = await Products.find().limit(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products' });
    }
});

/**
 * Get a product by its ID.
 */
productRouter.get('/:id', async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting product' });
    }
});

/**
 * Add a new product.
 */
productRouter.post('/', async (req, res) => {
    try {
        const { code } = req.body;
        const existingProduct = await Products.findOne({ code });
        if (existingProduct) {
            return res.status(400).json({ message: 'This product already exists' });
        }
        const newProduct = new Products({ ...req.body, status: true });
        const savedProduct = await newProduct.save();

        const io = getIo();
        io.emit('productAdded', savedProduct);

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Unexpected error' });
    }
});

/**
 * Update a product or create it if it doesn't exist.
 */
productRouter.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedProduct) {
            const io = getIo();
            io.emit('productUpdated', updatedProduct);
            res.json({ message: 'Product updated successfully' });
        } else {
            const newProduct = new Products(req.body);
            const savedProduct = await newProduct.save();
            res.status(201).json({ message: 'Product created successfully', product: savedProduct });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});

/**
 * Delete a product.
 */
productRouter.delete('/:id', async (req, res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        const io = getIo();
        io.emit('productDeleted', req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

export default productRouter;