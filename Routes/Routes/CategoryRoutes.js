import express from "express"
import uploadImage from "../../Middlewares/multer.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import { categoryController } from "../../controllers/category.js";
export const CategoryRoutes= express.Router()


CategoryRoutes.post('/create',verifyToken, checkRole(["artist"]), uploadImage.single("image"),categoryController.createCategory)
CategoryRoutes.get('/:id',categoryController.getCategoryById)
CategoryRoutes.get('/read/all',categoryController.getCategory)
CategoryRoutes.delete('/:id',verifyToken, checkRole(["artist"]),categoryController.deleteCategory)
CategoryRoutes.put('/update',verifyToken, checkRole(["artist"]),uploadImage.single("image"),categoryController.updateCategory)

export default CategoryRoutes;