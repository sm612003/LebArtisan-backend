const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
     type: String,
     required: true
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

module.exports = mongoose.model('Products', productSchema);
