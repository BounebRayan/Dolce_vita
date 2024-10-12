// models/Product.js
const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  rooms: {
    type: [String],
    trim: true,
  },
  weight: {
    type: Number,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  salePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  availableColors: [
    {
      type: String,
      trim: true,
    },
  ],
  isRecommended: {
    type: Boolean,
    default: false,
  },
  reviewsCount: {
    type: Number,
    min: 0,
    default: 0,
  },
  reviewsValue: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  mainImageNumber: {
    type: Number,
    required: true,
  },
  images: 
    {
      type: [String],
    },
  dimensions: {
    length: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
  },
  unitsSold:{
    type:Number, 
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field automatically
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;