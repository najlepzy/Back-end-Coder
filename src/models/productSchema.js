import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Schema for a product.
 * @type {mongoose.Schema}
 */
const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    }
}, { versionKey: false });

/**
 * Product model.
 * @type {mongoose.Model}
 */

ProductSchema.plugin(mongoosePaginate);

const Products = mongoose.model('Products', ProductSchema, 'Products');

export default Products;