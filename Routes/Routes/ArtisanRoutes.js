import express from "express"
import uploadImage from "../../Middlewares/multer.js";
import uploadVideo from '../../Middlewares/multer.js'
import {verifyToken,checkRole} from  '../../Middlewares/authentication.js'
import { artistController } from "../../controllers/artist.js";
export const ArtistRoutes= express.Router()


ArtistRoutes.post('/create', uploadVideo.single("about_us.video"),artistController.createArtist)
ArtistRoutes.get('/read/all',artistController.getAllArtists)
ArtistRoutes.get('/byName', artistController.getAllArtistsData);
ArtistRoutes.get('/:id', artistController.getArtistById);


ArtistRoutes.get('/ByCategory/:id', artistController.getArtistsByCategory); // Define routes with parameters after fixed routes
ArtistRoutes.delete('/:id',artistController.deleteArtistById)
ArtistRoutes.put('/update',verifyToken, checkRole(["artist"]),uploadImage.single("image"),artistController.updateArtistById)

export default ArtistRoutes;