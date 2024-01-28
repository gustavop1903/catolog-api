import User from "../models/users"
import { Request, Response } from "express";
import { isEmail } from "validator";

class UserControllers {

  async create(req: Request, res: Response) {
    console.log(req.body);
    try {
      const { name, email, password } = req.body

      // Validar se todos campos obrigatorios estão sendo enviados
      if (!name || !email || !password) {
        return res.status(400).json({ errors: 'All fields are mandatory' })
      }

      //validar formato de email
      if (!isEmail(email)) {
        return res.status(400).json({ error: 'E-mail invalid' });
      }

      //validar senha
      if (password.length < 8 || !/[0-9]/.test(password) || !/[!@#$%&*()/]/.test(password)) {
        return res.status(400).json({ error: 'Password invalid' });
      }

      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (e: any) {
      if (e.name === 'ValidationError') {
        res.status(400).json({ errors: e.errors.map((err: any) => err.message) });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  // async update(req: Request, res: Response) {
  //   try {

  //   }
  // };

  // async delete(req: Request, res: Response) {
  //   try {

  //   }
  // };
}


export default new UserControllers();