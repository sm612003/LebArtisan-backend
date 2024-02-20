import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
     { type: String,
         required: true
         },

    password:
     {
         type: String,
        required: true 
    },
    role: 
    { type: String,
         enum: ['admin', 'artist'],
          default: 'artist' },
    image:
     {
         type: String 
        },
   
    location:{
        type: String,
        required: true
    },
    whatsapp:{
        type:Number,
        required:true
    },
    instagram:{
        type:String,
        required:true
    },
    facebook:{
        type:String,
        required:true
    }
});

export default mongoose.model("User", userSchema);
