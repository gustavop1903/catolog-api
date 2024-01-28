import "mongoose";
import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema } from 'mongoose';

const ProductsSchema = new mongoose.Schema({
  _id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, require: true },
  price: { type: Float32Array },
  description: { type: Text },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const ProductsModel = mongoose.model('Product', ProductsSchema)

export default ProductsModel;