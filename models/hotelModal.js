import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const hotelSchema = Schema({
  imageUrl: String,
  propertyType: String,
  price: String,
  area: String,
  address: String,
  city: String,
  region: String,
  postal: String,
  location: String
}, { timestamps: true });

export default model('Hotel', hotelSchema);
