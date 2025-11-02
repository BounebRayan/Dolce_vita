export interface CategoryItem {
  text: string;
  type: string;
}

export interface HomepageCategory {
  id: number;
  link: string;
  name: string;
  image: string;
  showInHomepage?: boolean;
  order?: number;
}

export interface CategoriesConfig {
  deco: CategoryItem[];
  meuble: CategoryItem[];
}

export const categories: CategoriesConfig = {
  deco: [
    { text: 'Accessoires Déco', type: 'accessoires-deco' },
    { text: 'Art de la Table', type: 'art-de-la-table' },
    { text: 'Luminaires', type: 'luminaires' },
    { text: 'Vases', type: 'vases' },
    { text: 'Statues & Figurines', type: 'statues-figurines' },
    { text: 'Cadres & Photos', type: 'cadres-photos' },
    { text: 'Miroirs', type: 'miroirs' },
    { text: "Bougies & Parfums d'Intérieur", type: 'bougies-parfums-interieur' },
    { text: 'Linge de Maison', type: 'linge-de-maison' },
    { text: 'Décorations Murales', type: 'decorations-murales' },
    { text: 'Plantes & Fleurs', type: 'plantes' }
  ],
  meuble: [
    { text: 'Chambres', type: 'chambres' },
    { text: 'Salles à Manger', type: 'salles-a-manger' },
    { text: 'Canapés & Fauteuils', type: 'canapes-fauteuils' },
    { text: 'Tables Basses & de Coin', type: 'tables-basses-coin' },
    { text: "Consoles & Meubles d'Entrée", type: 'consoles-meubles-entree' }
  ]
};

// Helper functions for easy access
export const getCategoryByType = (type: string): CategoryItem | undefined => {
  const allCategories = [...categories.deco, ...categories.meuble];
  return allCategories.find(category => category.type === type);
};

export const getCategoryText = (type: string): string => {
  const category = getCategoryByType(type);
  return category?.text || type;
};

export const getAllCategories = (): CategoryItem[] => {
  return [...categories.deco, ...categories.meuble];
};

export const getCategoriesBySection = (section: keyof CategoriesConfig): CategoryItem[] => {
  return categories[section];
};

// Homepage categories with all the values needed for the homepage section
export const homepageCategories: HomepageCategory[] = [
  { id: 1, link: "/new", name: 'Outlet', image: '/images/categories/new.jpg', showInHomepage: true, order: 1 },
  { id: 2, link: "/decorations", name: 'Décorations', image: '/images/categories/collections.jpg', showInHomepage: true, order: 2 },
  { id: 3, link: "/promos", name: 'Promotions', image: '/images/categories/promos.jpg', showInHomepage: true, order: 3  },
  { id: 4, link: "/meubles", name: 'Meubles', image: '/images/categories/meubles.jpg', showInHomepage: true, order: 4 },
  { id: 10, link: "/categories/accessoires-deco", name: 'Accessoires déco', image: '/images/categories/accessoires-deco.jpg', showInHomepage: true, order: 10 },
  { id: 11, link: "/categories/vases", name: 'Vases', image: '/images/categories/vases.jpg', showInHomepage: true, order: 11 },
  { id: 12, link: "/categories/statues-figurines", name: 'Statues & Figurines', image: '/images/categories/statues.jpg', showInHomepage: true, order: 12 },
  { id: 13, link: "/categories/cadres-photos", name: 'Cadres & Photos', image: '/images/categories/cadres-photo.jpg', showInHomepage: true, order: 13 },
  { id: 14, link: "/categories/miroirs", name: 'Miroirs', image: '/images/categories/mirroirs.jpg', showInHomepage: true, order: 14 },
  { id: 15, link: "/categories/bougies-parfums-interieur", name: "Bougies & parfums d'intérieur", image: '/images/categories/bougie.jpg', showInHomepage: true, order: 15 },
  { id: 16, link: "/categories/decorations-murales", name: 'Déco murale', image: '/images/categories/decorations-murales.jpg', showInHomepage: true, order: 16 },
  { id: 17, link: "/categories/luminaires", name: 'Luminaires', image: '/images/categories/luminaires.jpg', showInHomepage: true, order: 17 },
  { id: 18, link: "/categories/plantes", name: 'Plantes & Fleurs', image: '/images/categories/plantes.jpg', showInHomepage: true, order: 18 },
  { id: 19, link: "/categories/art-de-la-table", name: 'Art de la Table', image: '/images/categories/art-de-la-table.jpg', showInHomepage: true, order: 19 },
  { id: 20, link: "/categories/linge-de-maison", name: 'Linge de maison', image: '/images/categories/linge-de-maison.jpg', showInHomepage: true, order: 20 },
];

// Helper function to get only categories that should be shown on homepage
export const getHomepageCategories = (): HomepageCategory[] => {
  return homepageCategories.filter(category => category.showInHomepage);
};
