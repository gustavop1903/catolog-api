import "mongoose";
import { v4 as uuidv4 } from "uuid";
import mongoose, { Schema } from 'mongoose';

const CategoriesSchema = new mongoose.Schema({
  _id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, require: true },
  description: { type: Text },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
});

const CategoriesModel = mongoose.model('Category', CategoriesSchema)

export default CategoriesModel;