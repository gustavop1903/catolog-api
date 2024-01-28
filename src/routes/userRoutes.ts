import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import userControllers from "../controllers/usersControllers";

const router = Router();

// router.post('/', userControllers.create);

//Protected routes
// router.use(authenticateToken)
// router.put('/:id', userControllers.update);
// router.delete('/:id', userControllers.delete);

export default router;