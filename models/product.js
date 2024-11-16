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

 
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;