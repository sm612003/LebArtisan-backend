import Workshop from "../model/Workshop.js";
import user from "../model/user.js";
import Category from "../model/Category.js";

export const workshopController = {
    // Create a new workshop
    createWorkshop: async (req, res) => {
        const {artisanId, title, description, date_time,  capacity, materials, cost, about } = req.body;
        const image = req.file.path


        try {
            const workshop = await Workshop.create({artisanId, title, description, date_time, image, capacity, materials, cost, about });
            return res.status(201).json(workshop); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get workshop by ID
    getWorkshopById: async (req, res) => {
        const { id } = req.params;

        try {
            const workshop = await Workshop.findById(id).populate('artisanId');
            if (!workshop) {
                return res.status(404).json({ message: 'Workshop not found' });
            }
            return res.status(200).json(workshop);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllWorkshops: async (req, res) => {
        try {
            const workshops = await Workshop.find().populate({
                path: 'artisanId',
                populate: { path: 'userId', select: 'name image' }
                
            });
    
            // Extract the required fields for each workshop
            const extractedWorkshops = await Promise.all(workshops.map(async (workshop) => {
                const artistName = workshop?.artisanId?.userId?.name || 'Unknown';
                const artistImage = workshop?.artisanId?.userId?.image || 'default-image.jpg';
    
                // Get category title from the artist's category ID
                const categoryTitle = await Category.findById(workshop?.artisanId?.categoryId).select('title');
    
                return {
                    title: workshop.title,
                    description: workshop.description,
                    image: workshop.image,
                    artistName,
                    artistImage,
                    categoryTitle: categoryTitle ? categoryTitle.title : 'Unknown' // Handle cases where categoryTitle is not found
                };
            }));
    
            return res.status(200).json(extractedWorkshops);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
,

    // Update workshop by ID
    updateWorkshopById: async (req, res) => {
        const { id } = req.params;
        const {artisanId, title, description, date_time, image, capacity, materials, cost, about } = req.body;

        try {
            const updatedWorkshop = await Workshop.findByIdAndUpdate(id, {artisanId, title, description, date_time, image, capacity, materials, cost, about }, { new: true });
            if (!updatedWorkshop) {
                return res.status(404).json({ message: 'Workshop not found' });
            }
            return res.status(200).json(updatedWorkshop);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete workshop by ID
    deleteWorkshopById: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedWorkshop = await Workshop.findByIdAndDelete(id);
            if (!deletedWorkshop) {
                return res.status(404).json({ message: 'Workshop not found' });
            }
            return res.status(200).json({ message: 'Workshop deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
