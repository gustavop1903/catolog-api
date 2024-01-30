import "mongoose";
import mongoose, { Schema } from 'mongoose';

const CategoriesSchema = new mongoose.Schema({
  //_id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, require: true, maxlength: 25, unique: true },
  description: { type: String, maxlength: 100 },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Category = mongoose.model('Category', CategoriesSchema)

export default Category;