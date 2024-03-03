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
// / Controller function to get all workshops for a specific artisan
 // Controller function to get all workshops for the currently logged-in artisan
 // Controller function to get all workshops for the currently logged-in artisan

  getWorkshopsByArtisanId : async (req, res) => {
    try {
      // Extract artist user ID from the authenticated user
      const artistUserId = req.user._id; // Assuming the user ID is available in req.user
  
      // Find the artist based on the user ID
      const artist = await Artist.findOne({ userId: artistUserId });
  
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      // Retrieve artisan ID from the found artist
      const artisanId = artist._id;
  
      // Query the Workshop model to find workshops associated with the provided artisanId
      const workshops = await Workshop.find({ artisanId }).populate('artisanId');
  
      if (!workshops || workshops.length === 0) {
        // If no workshops are found, return 404 Not Found
        return res.status(404).json({ message: "Workshops not found for this artisan." });
      }
  
      // If workshops are found, return them
      return res.status(200).json(workshops);
    } catch (error) {
      // If an error occurs during the database query, return 500 Internal Server Error
      console.error("Error fetching workshops:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
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
