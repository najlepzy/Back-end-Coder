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
    const cart = await Cart.findById(cartId);
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
 * Update a cart with an array of products.
 * @param {string} cartId - The ID of the cart.
 * @param {Array<{productId: string, quantity: number}>} products - The new array of products.
 * @returns {Promise<Cart>} The updated cart.
 */
  async updateCart(cartId, products) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    cart.products = products;
    await cart.save();
    return cart;
  }

  /**
  * Update the quantity of a specific product in a cart.
  * @param {string} cartId - The ID of the cart.
  * @param {string} productId - The ID of the product.
  * @param {number} quantity - The new quantity of the product.
  * @returns {Promise<Cart>} The updated cart.
  */
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }
    const product = cart.products.find(p => p.productId.toString() === productId);
    if (!product) {
      throw new Error('Product not found in cart');
    }
    product.quantity = quantity;
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
    const cartProduct = cart.products.find(p => p.productId.toString() === productId);
    if (!cartProduct) {
      throw new Error('Product not found in cart');
    }
    cartProduct.quantity -= 1;
    if (cartProduct.quantity === 0) {
      cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    }
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