import Router from "express";
import Controller from "./controller.js";

const router = new Router();

const routesController = new Controller();

router.post('/products', routesController.createProduct)
router.get('/products', routesController.getProducts)
router.put('/products', routesController.updateProduct)
router.delete('/products/:id', routesController.deleteProduct)

export default router;