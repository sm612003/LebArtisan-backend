import express from "express"
import uploadImage from "../../Middlewares/multer.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import { workshopController } from "../../controllers/workshop.js";
export const WorkshopRoutes= express.Router()


WorkshopRoutes.post('/create',uploadImage.single("image"),workshopController.createWorkshop)
WorkshopRoutes.get('/:id',workshopController.getWorkshopById)
WorkshopRoutes.get('/read/all',workshopController.getAllWorkshops)
WorkshopRoutes.get('/Artisan',verifyToken, checkRole(["artist"]),workshopController.getWorkshopsByArtisanId)

WorkshopRoutes.delete('/:id',workshopController.deleteWorkshopById)
WorkshopRoutes.put('/update',verifyToken, checkRole(["artist"]),uploadImage.single("image"),workshopController.updateWorkshopById)

export default WorkshopRoutes;