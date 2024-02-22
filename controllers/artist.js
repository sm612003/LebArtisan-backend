import Artist from "../model/Artist.js";
import user from "../model/user.js";
export const artistController = {
    // Create a new artist
    createArtist: async (req, res) => {
        const { userId, categoryId, craftType, bio, about_us, BrandName } = req.body;

        try {
            const artist = await Artist.create({ userId, categoryId, craftType, bio, about_us, BrandName });
            return res.status(201).json(artist); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // Get all artists with user images and brand names
    getAllArtistsData: async (req, res) => {
        try {
            // Fetch all artists
            const artists = await Artist.find();
            
            // Map over artists array to modify the data
            const modifiedArtists = await Promise.all(artists.map(async (artist) => {
                // Extract brand name from the artist
                const brandName = artist.BrandName;
                
                // Extract user's image from the userId
                const User = await user.findById(artist.userId);
                const userImage = User.image; // Assuming the image is stored in a field named "image" in the User model
                
                // Return modified artist object
                return {
                    _id: artist._id,
                    userId: artist.userId,
                    categoryId: artist.categoryId,
                    craftType: artist.craftType,
                    bio: artist.bio,
                    about_us: artist.about_us,
                    BrandName: brandName,
                    userImage: userImage
                };
            }));
            
            return res.status(200).json(modifiedArtists);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },
 // Get artists by category
// Get artists by category
getArtistsByCategory: async (req, res) => {
    const categoryId = req.params.id; // Retrieving category ID from URL parameter
    
    try {
        const artists = await Artist.find({ categoryId: categoryId }).populate('userId').populate('categoryId');
        return res.status(200).json(artists);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
},
    // Get artist by ID
    // getArtistById: async (req, res) => {
    //     const { id } = req.params;

    //     try {
    //         const artist = await Artist.findById(id);
    //         if (!artist) {
    //             return res.status(404).json({ message: 'Artist not found' });
    //         }
    //         return res.status(200).json(artist);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // },

    

    // Update artist by ID
    updateArtistById: async (req, res) => {
        const { id } = req.params;
        const { userId, categoryId, craftType, bio, about_us, BrandName } = req.body;

        try {
            const updatedArtist = await Artist.findByIdAndUpdate(id, { userId, categoryId, craftType, bio, about_us, BrandName }, { new: true });
            if (!updatedArtist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            return res.status(200).json(updatedArtist);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete artist by ID
    deleteArtistById: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedArtist = await Artist.findByIdAndDelete(id);
            if (!deletedArtist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            return res.status(200).json({ message: 'Artist deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
