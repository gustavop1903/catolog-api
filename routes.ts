import express from "express";

import userRoutes from "./src/routes/userRoutes";
import loginRoutes from "./src/routes/authRoutes";
import newUserRoutes from "./src/routes/newUserRoutes";

const routes = express.Router();

routes.use('/login', loginRoutes)

routes.use('/newuser', newUserRoutes)
routes.use('/users', userRoutes)
// routes.use('/categories',)
// routes.use('/products',)

export default routes;