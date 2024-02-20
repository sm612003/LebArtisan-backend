import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title:
  {
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
  date_time: {
    type: Date
  },
  Artisans: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Artist' }] // Array of references to Artist documents

});

export default mongoose.model("Event", eventSchema);
