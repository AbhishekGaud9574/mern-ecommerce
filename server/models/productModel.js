import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, //  Correct type
    ref: 'Category',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,  //  Prevent negative quantity
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  shipping: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ name: "text", description: "text" });

productSchema.pre("save", function () {
  this.inStock = this.quantity > 0;
});
export default mongoose.model("Products", productSchema);