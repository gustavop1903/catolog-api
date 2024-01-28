import { Router } from "express";
import userControllers from "../controllers/usersControllers";

const router = Router();

router.post('/', userControllers.create);

export default router;