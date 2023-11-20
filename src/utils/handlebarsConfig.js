import express from 'express';
import ProductManager from '../controllers/dao/productManager.js';

const handlebarsRouter = express.Router();
const productManager = new ProductManager();

handlebarsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

handlebarsRouter.get('/realtime-products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});


export default handlebarsRouter;