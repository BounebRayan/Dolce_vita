const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import the model
const HomepageImages = require('../models/homepageImages');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MongoDB URI environment variable');
  process.exit(1);
}

async function migrateHomepageImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read existing JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'homepage-images.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.log('No existing JSON file found. Creating default homepage images...');
      await HomepageImages.getHomepageImages();
      console.log('Default homepage images created successfully');
      return;
    }

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    console.log('Loaded existing JSON data');

    // Check if homepage images already exist in MongoDB
    const existingImages = await HomepageImages.findOne();
    if (existingImages) {
      console.log('Homepage images already exist in MongoDB. Updating with JSON data...');
      
      // Update existing document
      if (jsonData.banner) existingImages.banner = jsonData.banner;
      if (jsonData.aboutUs) existingImages.aboutUs = jsonData.aboutUs;
      if (jsonData.bannerOpacity !== undefined) existingImages.bannerOpacity = jsonData.bannerOpacity;
      
      if (jsonData.categories) {
        existingImages.categories = new Map(Object.entries(jsonData.categories));
      }
      
      if (jsonData.categoryVisibility) {
        existingImages.categoryVisibility = new Map(Object.entries(jsonData.categoryVisibility));
      }
      
      if (jsonData.categoryOrder) {
        existingImages.categoryOrder = jsonData.categoryOrder;
      }
      
      await existingImages.save();
      console.log('Homepage images updated successfully');
    } else {
      console.log('Creating new homepage images document...');
      
      // Create new document
      const newImages = new HomepageImages({
        banner: jsonData.banner || '/images/banner.jpg',
        aboutUs: jsonData.aboutUs || '/images/aboutus.jpg',
        bannerOpacity: jsonData.bannerOpacity || 30,
        categories: new Map(Object.entries(jsonData.categories || {})),
        categoryVisibility: new Map(Object.entries(jsonData.categoryVisibility || {})),
        categoryOrder: jsonData.categoryOrder || []
      });
      
      await newImages.save();
      console.log('Homepage images created successfully');
    }

    console.log('Migration completed successfully!');
    
    // Optional: Backup the JSON file before removing it
    const backupPath = path.join(process.cwd(), 'data', 'homepage-images.json.backup');
    fs.copyFileSync(jsonFilePath, backupPath);
    console.log(`JSON file backed up to: ${backupPath}`);
    
    // Optional: Remove the original JSON file
    // fs.unlinkSync(jsonFilePath);
    // console.log('Original JSON file removed');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration
migrateHomepageImages();

