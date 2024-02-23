import Workshop from "../model/Workshop.js";
import user from "../model/user.js";
import Category from "../model/Category.js";
import Artist from "../model/Artist.js";

export const workshopController = {
    // Create a new workshop
    createWorkshop: async (req, res) => {
        const { artisanId, title, description, date_time, capacity, materials, cost, about } = req.body;
        const image = req.file.path;

        try {
            const workshop = await Workshop.create({
                artisanId,
                title,
                description,
                date_time,
                image,
                capacity,
                materials,
                cost,
                about
            });
            return res.status(201).json(workshop); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
,

    // Get workshop by ID
    getWorkshopById: async (req, res) => {
        const { id } = req.params;
    
        try {
            const workshop = await Workshop.findById(id).populate({
                path: 'artisanId', // Correctly reference the field in the Workshop model
                select: 'userId', // Select the 'userId' field from the Workshop model
                populate: {
                    path: 'userId', // Populate the 'userId' field in the Artist model
                    select: 'whatsapp' // Select the 'whatsapp' field from the Artist model
                }
            });
            
            
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
            // Find all workshops and populate necessary fields
            const workshops = await Workshop.find().populate({
                path: 'artisanId',
                populate: { path: 'userId', select: 'name image whatsapp' } // Include the necessary fields from the 'userId' of the 'Artist' model
            });
            
    
            const extractedWorkshops = await Promise.all(workshops.map(async (workshop) => {
                const artistName = workshop?.artisanId?.userId?.name || 'Unknown';
                const artistImage = workshop?.artisanId?.userId ? workshop.artisanId.userId.image : 'default-image.jpg';
                const artistNumber = workshop?.artisanId?.userId?.whatsapp || ''; // Get the WhatsApp number
            
                // Get category title from the artist's category ID
                const category = await Artist.findById(workshop.artisanId).populate('categoryId');
                const categoryTitle = category?.categoryId?.title || 'Unknown';
            
                // Map the materials array to extract the required fields
                const materials = workshop.materials.map(material => ({
                    name: material.name,
                    description: material.description
                }));
            
                return {
                    _id: workshop._id,
                    title: workshop.title,
                    description: workshop.description,
                    date_time: workshop.date_time,
                    image: workshop.image,
                    capacity: workshop.capacity,
                    materials: materials,
                    cost: workshop.cost,
                    about: workshop.about,
                    artistName,
                    artistImage,
                    artistNumber, // Include WhatsApp number in the response
                    categoryTitle
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
