import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
