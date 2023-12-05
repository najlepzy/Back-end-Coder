import mongoose, { Schema } from 'mongoose';

/**
 * Schema for a cart item.
 * @type {mongoose.Schema}
 */
const CartItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    quantity: Number
}, { _id: false });

/**
 * Schema for a cart.
 * @type {mongoose.Schema}
 */
const CartSchema = new Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    products: [CartItemSchema]
}, { versionKey: false });

CartSchema.pre('find', function () {
    this.populate('products.productId', '_id title price thumbnail');
});

CartSchema.pre('findOne', function () {
    this.populate('products.productId', '_id title price thumbnail');
});
/**
 * Cart model.
 * @type {mongoose.Model}
 */
const Cart = mongoose.model('Carts', CartSchema, "Carts");

export default Cart;