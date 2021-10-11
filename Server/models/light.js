const mongoose = require('mongoose'); 
 
module.exports = new mongoose.Schema({ 
  floor: Number, 
  room: Number, 
  id: Number, 
  state: Number,
  users: Array
}); 