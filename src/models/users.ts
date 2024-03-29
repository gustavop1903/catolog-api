import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import mongoose, { Document } from 'mongoose';

// interface IUser extends Document {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// }

const UsersSchema = new mongoose.Schema({
  // _id: { type: String },
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
});


UsersSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const password = user.password as string;
  const hash = await bcrypt.hash(password, 10);;
  user.password = hash;
});

const User = mongoose.model('User', UsersSchema);

export default User;