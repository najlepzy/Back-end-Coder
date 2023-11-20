import Products from '../../models/productSchema.js';
import { getIo } from '../../config/socketIo.js';

/**
 * Class representing a product manager.
 */
class ProductManager {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  /**
   * Load all products.
   * @returns {Promise<void>}
   */
  async loadProducts() {
    this.products = await Products.find({});
  }

  /**
   * Get all products.
   * @returns {Array} The products.
   */
  getProducts() {
    return this.products;
  }

  /**
   * Get a product by its ID.
   * @param {string} id - The ID of the product.
   * @returns {Promise<Product>} The product.
   */
  async getProductById(id) {
    const product = await Products.findById(id);
    return product;
  }

  /**
   * Get a certain number of products.
   * @param {number} n - The number of products to get.
   * @returns {Promise<Array>} The products.
   */
  async getNProducts(n) {
    const products = await Products.find({}).limit(n);
    return products;
  }

  /**
   * Add a product.
   * @param {Object} productData - The data of the product.
   * @returns {Promise<void>}
   */
  async addProduct(productData) {
    const product = new Products(productData);
    await product.save();
    const io = getIo();
    io.emit('productAdded', product);
    await this.loadProducts();
  }

  /**
   * Update a product.
   * @param {string} id - The ID of the product.
   * @param {Object} newProductData - The new data of the product.
   * @returns {Promise<void>}
   */
  async updateProduct(id, newProductData) {
    const updatedProduct = await Products.findByIdAndUpdate(id, newProductData, { new: true });
    if (updatedProduct) {
      const io = getIo();
      io.emit('productUpdated', updatedProduct);
      await this.loadProducts();
    }
  }

  /**
   * Delete a product.
   * @param {string} id - The ID of the product.
   * @returns {Promise<void>}
   */
  async deleteProduct(id) {
    const deletedProduct = await Products.findByIdAndDelete(id);
    if (deletedProduct) {
      const io = getIo();
      io.emit('productDeleted', id);
      await this.loadProducts();
    }
  }
}

export default ProductManager;