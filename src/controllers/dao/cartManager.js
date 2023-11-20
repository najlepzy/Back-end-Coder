import Cart from "../../models/cartSchema.js"
import Product from "../../models/productSchema.js"

/**
 * Class representing a cart manager.
 */
class CartManager {

  /**
   * Create a cart with a product.
   * @param {string} productId - The ID of the product.
   * @returns {Promise<Cart>} The created cart.
   */
  async createCart(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const cart = new Cart();
    cart.products = [{
      productId: product._id,
      quantity: 1
    }];
    await cart.save();
    return cart;
  }

  /**
   * Get a cart by its ID.
   * @param {string} cartId - The ID of the cart.
   * @returns {Promise<Cart>} The cart.
   */
  async getCart(cartId) {
    const cart = await Cart.findById(cartId).populate('products.productId', '_id title price thumbnail');
    return cart;
  }

  /**
   * Add a product to a cart.
   * @param {string} cartId - The ID of the cart.
   * @param {string} productId - The ID of the product.
   * @returns {Promise<Cart>} The updated cart.
   */
  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    const cartProduct = cart.products.find(p => p.productId.toString() === productId.toString());
    if (cartProduct) {
      if (cartProduct.quantity + 1 > product.stock) {
        throw new Error('Exceeds product stock');
      }
      cartProduct.quantity += 1;
    } else {
      cart.products.push({
        productId: product._id,
        quantity: 1
      });
    }
    await cart.save();
    return cart;
  }

  /**
   * Remove a product from a cart.
   * @param {string} cartId - The ID of the cart.
   * @param {string} productId - The ID of the product.
   * @returns {Promise<Cart>} The updated cart.
   */
  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      throw new Error('Product not found in cart');
    }
    cart.products.splice(productIndex, 1);
    await cart.save();
    return cart;
  }

  /**
   * Delete a cart.
   * @param {string} cartId - The ID of the cart.
   * @returns {Promise<void>}
   */
  async deleteCart(cartId) {
    const result = await Cart.findByIdAndDelete(cartId);
    if (!result) {
      throw new Error('Cart not found');
    }
  }
}

export default CartManager;