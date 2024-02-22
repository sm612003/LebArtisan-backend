import express from "express"
import { productsController } from "../../controllers/products.js";
import uploadImage from "../../Middlewares/multer.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
export const productRoutes= express.Router()


productRoutes.post('/create', uploadImage.single("image"),productsController.createProduct)
productRoutes.get('/:id',productsController.getProductById)
productRoutes.get('/read/all',productsController.getProducts)
productRoutes.delete('/:id',verifyToken, checkRole(["artist"]),productsController.deleteProduct)
productRoutes.put('/update',verifyToken, checkRole(["artist"]),uploadImage.single("image"),productsController.editProduct)
productRoutes.get('/artisan/:id',productsController.getByArtisanId)

export default productRoutes;