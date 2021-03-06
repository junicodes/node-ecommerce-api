import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        categories: { type: Array, required: true },
        sizes: { type: Array },
        colors: { type: Array },
        image: { type: Object, required: true },
        price: { type: String, required: true },
        currency: { type: String, required: true },
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("products", ProductSchema)