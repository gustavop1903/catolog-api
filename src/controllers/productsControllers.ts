import { Request, Response } from 'express';
import Categories from '../models/categories';
import Product from '../models/products';
import User from '../models/users';
import snsPublish from "../../utils/aws/awsSnsConfig";
import { verifyOwnerCurrent } from "../../utils/shortcuts/verifyOwnerCurrent";

class ProductsControllers {

  async create(req: Request, res: Response) {
    try {
      const { title, description, price, ownerId, categoryId } = req.body;
      const userAuthenticated = req.user.userId

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!price) {
        return res.status(400).json({ error: 'Price is required' });
      }
      const productname = await Product.findOne({ title, ownerId: ownerId });
      if (productname) {
        return res.status(400).json({ error: 'This tilte already exist' });
      }
      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }
      if (!ownerId) {
        return res.status(400).json({ error: 'OwnerId is required' });
      }
      const user = await User.findById(ownerId);
      if (!user) {
        return res.status(400).json({ error: 'Owner user does not exist' });
      }
      if (!categoryId) {
        return res.status(400).json({ error: 'Category is required' });
      }
      const category = await Categories.findById(categoryId);
      if (!category) {
        return res.status(400).json({ error: 'Category is not exists' });
      }
      verifyOwnerCurrent(ownerId, userAuthenticated);

      const newProduct = await Product.create(req.body);

      await snsPublish(newProduct);

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error creating products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async patch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, price, categoryId } = req.body;

      const userAuthenticated = req.user.userId
      const product = await Product.findById(id);
      const category = await Categories.findById(categoryId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (categoryId) {
        if (!category)
          return res.status(404).json({ error: 'Category not found' });
      }
      if (req.body.ownerId && req.body.ownerId !== product.ownerId) {
        return res.status(403).json({ error: 'Cannot change ownerId' });
      }
      verifyOwnerCurrent(product.ownerId!.toString(), userAuthenticated);

      if (title !== undefined && title.trim() !== '') product.title = title;
      if (description !== undefined && description.trim() !== '') product.description = description;
      if (price !== undefined && price.trim() !== '') product.price = price;
      if (categoryId) product.categoryId = categoryId;

      await product.save();
      await snsPublish(product)

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      const userAuthenticated = req.user.userId

      if (!product) {
        return res.status(404).json({ error: 'product not found' });
      }
      verifyOwnerCurrent(product.ownerId!.toString(), userAuthenticated);

      await product.deleteOne();
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

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'product not found' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const products = await Product.find();
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error getting all products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new ProductsControllers();
