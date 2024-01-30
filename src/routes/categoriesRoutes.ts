import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import CategoryController from "../controllers/categoriesControllers";

const router = Router();

//Protected routes
router.use(authenticateToken)

router.post('/', CategoryController.create);
router.get('/', CategoryController.index);
router.get('/:id', CategoryController.show);
router.patch('/:id', CategoryController.patch);
router.delete('/:id', CategoryController.delete);

export default router;