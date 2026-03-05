const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');


const homeSchema = new mongoose.Schema({
    houseName: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        
    },
    price: {
        type: Number,
        required: true
    },
    location: { 
        type: String,
        required: true
    },  
    image: {
        type: String,
      
    }
});

// homeSchema.pre('findOneAndDelete', async function(next) {
//   const homeId = this.getQuery()['_id'];
//   await favourite.deleteMany({ houseId: homeId });
// });

module.exports = mongoose.model('Home', homeSchema);

