import express from "express"
import uploadImage from "../../Middlewares/multer.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import { eventController } from "../../controllers/events.js";
export const EventRoutes= express.Router()


EventRoutes.post('/create',verifyToken, checkRole(["admin"]), uploadImage.single("image"),eventController.createEvent)
EventRoutes.get('/:id',eventController.getEventById)
EventRoutes.get('/read/all',eventController.getAllEvents)
EventRoutes.delete('/:id',verifyToken, checkRole(["admin"]),eventController.deleteEventById)
EventRoutes.put('/update',verifyToken, checkRole(["admin"]),uploadImage.single("image"),eventController.updateEventById)
 export default EventRoutes;