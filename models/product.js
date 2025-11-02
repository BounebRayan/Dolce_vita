// models/Product.js
const mongoose = require('mongoose');
// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  // Basic Information
  reference: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  
  // Categorization
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Meubles', 'Déco'],
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    index: true
  },
  subSubCategory: {
    type: String,
    trim: true,
    index: true
  },
  
  // Content
  description: {
    type: String,
    trim: true,
    maxlength: 2000,
    required: true
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10; // Limit to 10 images
      },
      message: 'Cannot have more than 10 images'
    }
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0,
    max: 100000,
    index: true
  },
  onSale: {
    type: Boolean,
    default: false,
    index: true
  },
  salePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  saleStartDate: {
    type: Date
  },
  saleEndDate: {
    type: Date
  },
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Visual Properties
  availableColors: [{
    name: {
      type: String,
      trim: true
    },
    hex: {
      type: String,
      match: /^#[0-9A-F]{6}$/i
    },
    image: String
  }],
  materials: [{
    type: String,
    trim: true
  }],
  
  // Dimensions and Weight
  dimensions: {
    length: {
      type: Number,
      min: 0
    },
    width: {
      type: Number,
      min: 0
    },
    height: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['cm', 'm', 'in', 'ft'],
      default: 'cm'
    }
  },
  weight: {
    value: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['g', 'kg', 'lb', 'oz'],
      default: 'kg'
    }
  },
  
  // Marketing Flags
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isHot: {
    type: Boolean,
    default: false,
    index: true
  },
  isBestSeller: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Analytics
  unitsSold: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  addedToCart: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status and Dates
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
// Virtual fields
productSchema.virtual('salePrice').get(function() {
  if (this.onSale && this.salePercentage > 0) {
    return this.price * (1 - this.salePercentage / 100);
  }
  return this.price;
});

productSchema.virtual('isOnSale').get(function() {
  const now = new Date();
  return this.onSale && 
         (!this.saleStartDate || this.saleStartDate <= now) &&
         (!this.saleEndDate || this.saleEndDate >= now);
});

productSchema.virtual('fullDimensions').get(function() {
  if (!this.dimensions.length || !this.dimensions.width || !this.dimensions.height) {
    return null;
  }
  return `${this.dimensions.length} × ${this.dimensions.width} × ${this.dimensions.height} ${this.dimensions.unit}`;
});

// Instance methods
productSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

productSchema.methods.incrementAddedToCart = function() {
  this.addedToCart += 1;
  return this.save();
};

// Static methods
productSchema.statics.findByCategory = function(category, limit = 12) {
  return this.find({ category, isAvailable: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

productSchema.statics.findBySubCategory = function(subCategory, limit = 12) {
  return this.find({ subCategory, isAvailable: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

productSchema.statics.findOnSale = function(limit = 12) {
  return this.find({ 
    onSale: true, 
    isAvailable: true,
    $or: [
      { saleStartDate: { $lte: new Date() } },
      { saleStartDate: { $exists: false } }
    ],
    $or: [
      { saleEndDate: { $gte: new Date() } },
      { saleEndDate: { $exists: false } }
    ]
  })
  .sort({ salePercentage: -1 })
  .limit(limit);
};

productSchema.statics.findFeatured = function(limit = 12) {
  return this.find({ 
    isFeatured: true, 
    isAvailable: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

productSchema.statics.findBestSellers = function(limit = 12) {
  return this.find({ 
    isBestSeller: true, 
    isAvailable: true 
  })
  .sort({ unitsSold: -1 })
  .limit(limit);
};

productSchema.statics.findHot = function(limit = 12) {
  return this.find({ 
    isHot: true, 
    isAvailable: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

productSchema.statics.findNew = function(limit = 12) {
  return this.find({ 
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    isAvailable: true 
  })
  .sort({ createdAt: -1 })
  .limit(limit);
};

productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchQuery = {
    isAvailable: true,
    $or: [
      { productName: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
      { keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (filters.category) {
    searchQuery.category = filters.category;
  }
  if (filters.priceMin || filters.priceMax) {
    searchQuery.price = {};
    if (filters.priceMin) searchQuery.price.$gte = filters.priceMin;
    if (filters.priceMax) searchQuery.price.$lte = filters.priceMax;
  }
  if (filters.onSale) {
    searchQuery.onSale = true;
  }
  if (filters.availability) {
    searchQuery.availability = filters.availability;
  }

  return this.find(searchQuery);
};

// Indexes for better performance
productSchema.index({ productName: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1, subSubCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ onSale: 1, salePercentage: -1 });
productSchema.index({ isFeatured: 1, isHot: 1, isBestSeller: 1 });
productSchema.index({ unitsSold: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;