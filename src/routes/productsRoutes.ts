import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
// import { } from "../controllers/productsControllers";

const router = Router();

//Protected routes
// router.use(authenticateToken)
// router.put('/:id', userControllers.update);
// router.delete('/:id', userControllers.delete);

export default router;