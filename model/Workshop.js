import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  title: { type: String, required: true },
  description: { type: String },
  date_time: { type: Date },
  image: { type: String, required: true },
  capacity: {
    type: Number,
    required: true
  },
  materials: [{ type: String }], // Array of materials required for the workshop
  cost: { type: Number }, // Cost of the workshop
  about: { type: String }, // Description about the workshop attendees/target audience
});

export default mongoose.model("Workshop", workshopSchema);
