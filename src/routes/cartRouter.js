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
 * Remove a product from a cart.
 * @route DELETE /:cartId/:productId
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
cartRouter.delete('/:cartId/:productId', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cartId, req.params.productId);
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