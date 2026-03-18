import { Router } from 'express';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import brandRoutes from './brandRoutes.js';

const routes = Router();

// Mount Routes
routes.use('/products', productRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/brands', brandRoutes);

// FIX: Export as default
export default routes;
