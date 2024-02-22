import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
     type: String,
     },

     image: 
     {
         type: String ,
       required: true
    },
    artisanId: 
    { type: mongoose.Schema.Types.ObjectId,
         ref: 'Artist' },



});

export default mongoose.model("Products", productSchema);
