import express from "express"
import uploadImage from "../../Middlewares/multer.js";
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import { artistController } from "../../controllers/artist.js";
export const ArtistRoutes= express.Router()


ArtistRoutes.post('/create',verifyToken, checkRole(["artist"]), uploadImage.single("image"),artistController.createArtist)
ArtistRoutes.get('/:id',artistController.getArtistById)
ArtistRoutes.get('/read/all',artistController.getAllArtists)
ArtistRoutes.delete('/:id',verifyToken, checkRole(["artist"]),artistController.deleteArtistById)
ArtistRoutes.put('/update',verifyToken, checkRole(["artist"]),uploadImage.single("image"),artistController.updateArtistById)

export default ArtistRoutes;