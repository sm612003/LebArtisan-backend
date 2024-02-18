import Workshop from "../model/Workshop.js";

export const workshopController = {
    // Create a new workshop
    createWorkshop: async (req, res) => {
        const {artisanId, title, description, date_time, image, capacity, materials, cost, about } = req.body;

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

    // Get all workshops
    getAllWorkshops: async (req, res) => {
        try {
            const workshops = await Workshop.find().populate('artisanId');
            return res.status(200).json(workshops);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

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
