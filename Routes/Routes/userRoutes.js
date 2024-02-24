import express from "express";
import userController from "../../controllers/user.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import uploadImage from "../../Middlewares/multer.js";

export const userRoutes = express.Router();

userRoutes.post('/register',uploadImage.single("image"), userController.register);
userRoutes.get('/all',  userController.getAllUsers);
userRoutes.get('/:id', verifyToken, userController.getUserById);
userRoutes.put('/:id', verifyToken, userController.updateUserById);
userRoutes.delete('/:id', verifyToken, checkRole(["admin"]), userController.deleteUserById);

userRoutes.get('/read/one', verifyToken, userController.getOneUser);

export default userRoutes;