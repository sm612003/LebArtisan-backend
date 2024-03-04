import Event from "../model/Event.js";
import Artist from "../model/Artist.js";
import user from "../model/user.js";
import mongoose from "mongoose";
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
    getEventById: async (req, res) => {
        const { id } = req.params;

        try {
            const event = await Event.findById(id).populate('Artisans.artist');
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(200).json(event);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // getEventById: async (req, res) => {
    //   const { id } = req.params;
    
    //   try {
    //     const event = await Event.findById(id)
    //       .populate({
    //         path: 'Artisans',
    //         populate: {
    //           path: 'userId',
    //           model: 'User'
    //         }
    //       })
    //       .exec();
    
    //     if (!event) {
    //       return res.status(404).json({ message: 'Event not found' });
    //     }
    
    //     return res.status(200).json(event);
    //   } catch (error) {
    //     console.error('Error fetching event details:', error);
    //     return res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // },
    
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
    },
    requestToJoinEvent: async (req, res) => {
      try {
        // Extract artist user ID from the authenticated user
        const artistUserId = req.user._id; // Assuming the user ID is available in req.user
    
        // Find the artist based on the user ID
        const artist = await Artist.findOne({ userId: artistUserId });
    
        if (!artist) {
          return res.status(404).json({ message: 'Artist not found' });
        }
    
        // Assuming you pass event ID as a parameter in the request body or query
        const eventId = req.body.eventId; // Assuming eventId is sent in the request body
    
        // Find the event
        const event = await Event.findById(eventId);
    
        if (!event) {
          return res.status(404).json({ message: 'Event not found' });
        }
    
        // Check if the artist is already in the event
        const isArtistAlreadyInEvent = event.Artisans.some(item => item.artist.toString() === artist._id.toString());
        if (isArtistAlreadyInEvent) {
          return res.status(400).json({ message: 'Artist is already in the event' });
        }
    
        // Add the artist to the event with 'pending' status
        event.Artisans.push({ artist: artist._id, status: 'pending' });
    
        // Save the event
        await event.save();
    
        res.status(200).json({ message: 'Request sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
    }
    
    ,
    manageEventParticipationRequest: async (req, res) => {
      try {
          const { eventId, participationRequests } = req.body;
          // console.log(participationRequests)
    
          // Check if the event exists
          const event = await Event.findById(eventId);
          if (!event) {
              return res.status(404).json({ message: "Event not found" });
          }

          // console.log(event)
    
          // Ensure that participationRequests is an array
          if (!Array.isArray(participationRequests)) {
              return res.status(400).json({ message: "Participation requests must be an array" });
          }
    
          // Update the status of each artist's participation request using a for...of loop
          for (const { artistId, status } of participationRequests) {
            const artisan = event.Artisans.find(request => request.artist.toString() === artistId);
            if (artisan) {
                artisan.status = status;
            }
        }
        
        // Mark the 'Artisans' path as modified
        event.markModified('Artisans');
        
        // Save the updated event
        await event.save();

          console.log("after" ,event.Artisans)
    
          return res.status(200).json({ message: "Event participation requests updated successfully" });
      } catch (error) {
          console.error("Error managing event participation requests:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
    },




// Backend Controller to get all artists with status "accepted" for a specific event
// Backend Controller to get all artists with status "accepted" for a specific event
getAcceptedArtistsForEvent: async (req, res) => {
  try {
      const { eventId } = req.params;
      
      // Find the event and populate the Artisans array with artist details
      const event = await Event.findById(eventId).populate({
          path: 'Artisans',
          populate: {
              path: 'artist',
              select: 'BrandName craftType userId', // Include BrandName and craftType
              populate: {
                  path: 'userId',
                  select: 'image' // Select image field from User model
              }
          }
      });
      
      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      // Filter only the accepted artists
      const acceptedArtists = event.Artisans.filter(request => request.status === 'accepted').map(request => ({
          _id: request.artist._id,
          image: request.artist.userId.image,
          BrandName: request.artist.BrandName,
          craftType: request.artist.craftType
      }));

      return res.status(200).json(acceptedArtists);
  } catch (error) {
      console.error("Error fetching accepted artists for event:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
}

,
// Assuming you have already imported the necessary modules and the Event model

 getArtistStatusForEvent : async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id; // Assuming you have the user ID in the request

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the artist's participation status for this event
    const artistRequest = event.Artisans.find(request => request.artist.toString() === userId);
    if (!artistRequest) {
      return res.status(404).json({ message: 'Artist participation request not found' });
    }

    // Return the artist's participation status
    res.status(200).json({ status: artistRequest.status });
  } catch (error) {
    console.error('Error fetching artist participation status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}



  
};
