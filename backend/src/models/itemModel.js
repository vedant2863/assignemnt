import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", ItemSchema);
