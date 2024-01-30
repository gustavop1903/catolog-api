import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import ProductsControllers from "../controllers/productsControllers";

const router = Router();

//Protected routes
router.use(authenticateToken)

router.post('/', ProductsControllers.create);
router.get('/', ProductsControllers.index);
router.get('/:id', ProductsControllers.show);
router.patch('/:id', ProductsControllers.patch);
router.delete('/:id', ProductsControllers.delete);

export default router;