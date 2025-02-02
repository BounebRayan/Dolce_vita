import mongoose from "mongoose";

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Percentage discount, e.g., 10 for 10%
  isActive: { type: Boolean, default: true }, // Ensure the code is active
  expiresAt: { type: Date, required: false }, // Optional expiration date
});

export default mongoose.models.PromoCode || mongoose.model("PromoCode", PromoCodeSchema);
