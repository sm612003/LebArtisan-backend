import Artist from "../model/Artist";

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

    // Get artist by ID
    getArtistById: async (req, res) => {
        const { id } = req.params;

        try {
            const artist = await Artist.findById(id);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            return res.status(200).json(artist);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get all artists
    getAllArtists: async (req, res) => {
        try {
            const artists = await Artist.find();
            return res.status(200).json(artists);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

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
