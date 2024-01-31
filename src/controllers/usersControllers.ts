import User from "../models/users"
import { Request, Response } from "express";
import { isEmail } from "validator";

class UserControllers {

  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body

      if (!name || !email || !password) {
        return res.status(400).json({
          errors: 'All fields are mandatory'
        })
      }
      if (!isEmail(email)) {
        return res.status(400).json({
          error: 'E-mail invalid'
        });
      }
      if (password.length < 8 || !/[0-9]/.test(password)
        || !/[!@#$%&*()/]/.test(password)) {
        return res.status(400).json({
          error: 'Password invalid'
        });
      }

      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (e: any) {

      if (e.name === 'ValidationError') {
        res.status(400).json({
          errors: e.errors.map((err: any) => err.message)
        });
      } else {
        res.status(500).json({
          errors: e.message
        });
      }
    }
  };

  async index(req: Request, res: Response) {
    try {
      const users = await User.find();

      const usersWithoutPass = users.map(user => {
        const { password, ...userWithoutPass } = user.toObject();
        return userWithoutPass;
      })
      return res.json(usersWithoutPass);
    } catch (e: any) {
      return res.json(null);
    }
  };

  async patch(req: Request, res: Response) {

    try {
      const { name, email, password } = req.body;

      if (email && !isEmail(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      if (password && (password.length < 8 || !/[0-9]/.test(password) ||
        !/[!@#$%&*()/]/.test(password))) {
        return res.status(400).json({
          error: 'Invalid password format'
        });
      }

      if (!req.params.id) {
        return res.status(400).json({
          errors: ['ID não enviado']
        })
      }
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({
          errors: ['ID inválido']
        })
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;

      await user.save()

      return res.status(200).json(user);
    } catch (e: any) {
      return res.status(500).json(
        { errors: e.message }
      );
    }
  };

  async delete(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.deleteOne();

      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

};


export default new UserControllers();