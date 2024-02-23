import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date, // Date for the event
    required: true
  },
  start_time: {
    type: String, // Start time of the event
    required: true
  },
  end_time: {
    type: String, // End time of the event
    required: true
  },
  Artisans: [{
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
});

export default mongoose.model("Event", eventSchema);
