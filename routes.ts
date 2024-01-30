import { Router } from "express";

import loginRoutes from "./src/routes/loginRoutes";
import newUserRoutes from "./src/routes/newUserRoutes";

import userRoutes from "./src/routes/userRoutes";
import categoryRoutes from "./src/routes/categoriesRoutes"
import productRoutes from './src/routes/productsRoutes'

const routes = Router();

routes.use('/login', loginRoutes)
routes.use('/newuser', newUserRoutes)

routes.use('/users', userRoutes)
routes.use('/categories', categoryRoutes)
routes.use('/products', productRoutes)

export default routes;