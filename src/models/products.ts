import "mongoose";
import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema } from 'mongoose';

const ProductsSchema = new mongoose.Schema({
  // _id: { type: String },
  title: { type: String, require: true, maxlength: 25 },
  description: { type: String, require: true, maxlength: 500 },
  price: { type: Number, require: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', require: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
});

const Product = mongoose.model('Product', ProductsSchema)

export default Product;