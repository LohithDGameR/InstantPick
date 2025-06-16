// models/DeliveryBoy.js
import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const DeliveryBoy =
  mongoose.models.deliveryBoy ||
  mongoose.model("deliveryBoy", deliveryBoySchema);
export default DeliveryBoy;
