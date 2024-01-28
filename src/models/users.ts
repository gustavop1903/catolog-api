import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import mongoose, { Document } from 'mongoose';

// interface IUser extends Document {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// }

const UserSchema = new mongoose.Schema({
  // _id: { type: String, unique: true, default: uuidv4 },
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
});


UserSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();
  console.log(user.password);

  const password = user.password as string;
  const hash = await bcrypt.hash(password, 10);;
  user.password = hash;

  next();
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;