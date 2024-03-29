import "mongoose";
import mongoose, { Schema } from 'mongoose';

const CategoriesSchema = new mongoose.Schema({
  // _id: { type: String },
  title: { type: String, require: true, maxlength: 25 },
  description: { type: String, maxlength: 100 },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Category = mongoose.model('Category', CategoriesSchema)

export default Category;