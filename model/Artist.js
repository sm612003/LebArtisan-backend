import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  craftType: { type: String },
  bio: { type: String },
  about_us: {
    title: { type: String },
    description: { type: String },
    video_url: { type: String } // URL of the video
  },
  BrandName: {
  type:String,
  required:true,
  }
});


export default mongoose.model("Artist", artistSchema);
