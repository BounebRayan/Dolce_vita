const mongoose = require('mongoose');

const homepageImagesSchema = new mongoose.Schema({
  banner: {
    type: String,
    default: '/images/banner.jpg'
  },
  aboutUs: {
    type: String,
    default: '/images/aboutus.jpg'
  },
  bannerOpacity: {
    type: Number,
    default: 30
  },
  categories: {
    type: Map,
    of: String,
    default: new Map()
  },
  categoryVisibility: {
    type: Map,
    of: Boolean,
    default: new Map()
  },
  categoryOrder: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Create a singleton document
homepageImagesSchema.statics.getHomepageImages = async function() {
  let images = await this.findOne();
  if (!images) {
    // Create default homepage images if none exist
    images = new this({
      banner: '/images/banner.jpg',
      aboutUs: '/images/aboutus.jpg',
      bannerOpacity: 30,
      categories: new Map([
        ['new', '/images/categories/new.jpg'],
        ['collections', '/images/categories/collections.jpg'],
        ['meubles', '/images/categories/meubles.jpg'],
        ['art-de-la-table', '/images/categories/art-de-la-table.jpg'],
        ['accessoires-deco', '/images/categories/accessoires-deco.jpg'],
        ['vases', '/images/categories/vases.jpg'],
        ['luminaires', '/images/categories/luminaires.jpg'],
        ['miroirs', '/images/categories/mirroirs.jpg'],
        ['decorations-murales', '/images/categories/decorations-murales.jpg'],
        ['cadres-photo', '/images/categories/cadres-photo.jpg'],
        ['linge-de-maison', '/images/categories/linge-de-maison.jpg'],
        ['bougies-parfums-interieur', '/images/categories/bougie.jpg'],
        ['statues', '/images/categories/statues.jpg'],
        ['plantes', '/images/categories/plantes.jpg']
      ]),
      categoryVisibility: new Map([
        ['new', true],
        ['collections', false],
        ['meubles', true],
        ['art-de-la-table', true],
        ['accessoires-deco', true],
        ['vases', true],
        ['luminaires', true],
        ['miroirs', true],
        ['decorations-murales', true],
        ['cadres-photo', true],
        ['linge-de-maison', true],
        ['bougies-parfums-interieur', true],
        ['statues', true],
        ['plantes', true]
      ]),
      categoryOrder: [
        'new',
        'collections',
        'meubles',
        'art-de-la-table',
        'accessoires-deco',
        'vases',
        'luminaires',
        'miroirs',
        'decorations-murales',
        'cadres-photo',
        'linge-de-maison',
        'bougies-parfums-interieur',
        'statues',
        'plantes'
      ]
    });
    await images.save();
  }
  return images;
};

homepageImagesSchema.statics.updateHomepageImages = async function(updates) {
  let images = await this.findOne();
  if (!images) {
    images = await this.getHomepageImages();
  }

  // Update fields
  if (updates.banner) images.banner = updates.banner;
  if (updates.aboutUs) images.aboutUs = updates.aboutUs;
  if (updates.bannerOpacity !== undefined) images.bannerOpacity = updates.bannerOpacity;
  
  if (updates.categoryKey && updates.categoryImage) {
    images.categories.set(updates.categoryKey, updates.categoryImage);
  }
  
  if (updates.categoryVisibilityKey !== undefined && updates.categoryVisibilityValue !== undefined) {
    images.categoryVisibility.set(updates.categoryVisibilityKey, updates.categoryVisibilityValue);
  }
  
  if (updates.categoryOrder) {
    images.categoryOrder = updates.categoryOrder;
  }

  await images.save();
  return images;
};

module.exports = mongoose.models.HomepageImages || mongoose.model('HomepageImages', homepageImagesSchema);

