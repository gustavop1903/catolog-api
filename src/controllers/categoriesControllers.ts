import { Request, Response } from 'express';
import Categories from '../models/categories';
import User from '../models/users';
import Product from '../models/products';
import snsPublish from "../../utils/aws/awsSnsConfig";
import { verifyOwnerCurrent } from "../../utils/shortcuts/verifyOwnerCurrent";

class CategoryControllers {

  async create(req: Request, res: Response) {
    try {
      const { title, ownerId } = req.body;

      const userAuthenticated = req.user.userId
      const categoryname = await Categories.findOne({ title, ownerId: ownerId });

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!ownerId) {
        return res.status(400).json({ error: 'OwnerId is required' });
      }
      verifyOwnerCurrent(ownerId, userAuthenticated);

      if (categoryname) {
        return res.status(400).json({ error: 'Category with this title already exists' });
      }

      const newCategory = await Categories.create(req.body);
      await snsPublish(newCategory);

      return res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async patch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const userAuthenticated = req.user.userId
      const category = await Categories.findById(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      if (req.body.ownerId && req.body.ownerId !== category.ownerId) {
        return res.status(403).json({ error: 'Cannot change ownerId' });
      }
      verifyOwnerCurrent(category.ownerId!.toString(), userAuthenticated);

      if (title !== undefined && title.trim() !== '') category.title = title;
      if (description) category.description = description;

      await category.save();
      await snsPublish(category);

      return res.status(200).json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await Categories.findById(id);
      const userAuthenticated = req.user.userId

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      verifyOwnerCurrent(category.ownerId!.toString(), userAuthenticated);

      await Product.deleteMany({ categoryId: id });
      await category.deleteOne();
      await snsPublish(req.params)

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await Categories.findById(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      return res.status(200).json(category);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const categories = await Categories.find();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error getting all categories:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CategoryControllers();
