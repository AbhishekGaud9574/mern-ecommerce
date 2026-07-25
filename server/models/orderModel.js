import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      cartQuantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
      },
    },
  ],

  payment: {
    method: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  status: {
    type: String,
    enum: [
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Returned",
    ],
    default: "Processing",
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  }

}, { timestamps: true });

orderSchema.index({ buyer: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);