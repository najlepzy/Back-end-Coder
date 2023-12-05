import express from 'express';
import CartManager from '../controllers/dao/cartManager.js';

const cartRouter = express.Router();
const cartManager = new CartManager();

/**
 * Get a cart by its ID.
 * @route GET /:cartId
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.get('/:cartId', async (req, res) => {
    const cart = await cartManager.getCart(req.params.cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

/**
 * Create a new cart with a product.
 * @route POST /
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.post('/', async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await cartManager.createCart(productId);
        res.json(cart);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Add a product to a cart.
 * @route POST /:cartId
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.post('/:cartId', async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await cartManager.addProductToCart(req.params.cartId, productId);
        res.json(cart);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Update a cart with an array of products.
 * @route PUT /api/carts/:cid
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.put('/:cid', async (req, res) => {
    const { products } = req.body;
    try {
        const cart = await cartManager.updateCart(req.params.cid, products);
        res.json(cart);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Update the quantity of a specific product in a cart.
 * @route PUT /api/carts/:cid/products/:pid
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { quantity } = req.body;
    try {
        const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(cart);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Remove a product from a cart.
 * @route DELETE /:cartId/:productId
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Delete a cart.
 * @route DELETE /:cartId
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.delete('/:cartId', async (req, res) => {
    try {
        await cartManager.deleteCart(req.params.cartId);
        res.status(200).send('Cart deleted successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default cartRouter;