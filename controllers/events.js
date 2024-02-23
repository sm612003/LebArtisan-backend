import Event from "../model/Event.js";
export const eventController = {
    // Create a new event
    createEvent: async (req, res) => {
        const { title, description, location, date, start_time, end_time } = req.body;
        const image = req.file.path;
    
        try {
            const event = await Event.create({ 
                title,
                description,
                location,
                image,
                date,
                start_time,
                end_time
            });
            
            return res.status(201).json(event); // 201 status for successful creation
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
,    
joinEvent :async (req, res) => {
    const { eventId } = req.params;
    const { artistData } = req.body;
  
    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      // Add artist to the event's Artisans array with default status 'pending'
      event.Artisans.push({ artist: artistData });
      await event.save();
  
      return res.status(201).json({ message: 'Artist joined event successfully' });
    } catch (error) {
      console.error('Error joining event:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
    // Get event by ID
    getEventById: async (req, res) => {
        const { id } = req.params;

        try {
            const event = await Event.findById(id).populate('Artisans');
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get all events
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find().populate('Artisans');
            return res.status(200).json(events);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update event by ID
    updateEventById: async (req, res) => {
        const { id } = req.params;
        const { title, description, location, date_time, Artisans } = req.body;
        const image = req.file ? req.file.path : null;


        try {
            const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, location, image, date_time, Artisans }, { new: true });
            if (!updatedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json(updatedEvent);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Delete event by ID
    deleteEventById: async (req, res) => {
        const { id } = req.params;

        try {
            const deletedEvent = await Event.findByIdAndDelete(id);
            if (!deletedEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json({ message: 'Event deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
