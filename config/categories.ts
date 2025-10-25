export interface CategoryItem {
  text: string;
  type: string;
}

export interface CategoriesConfig {
  deco: CategoryItem[];
  meuble: CategoryItem[];
}

export const categories: CategoriesConfig = {
  deco: [
    { text: 'Accessoires Déco', type: 'accessoires-deco' },
    { text: 'Art de la Table', type: 'art-de-la-table' },
    { text: 'Vases', type: 'vases' },
    { text: 'Luminaires', type: 'luminaires' },
    { text: 'Miroirs', type: 'miroirs' },
    { text: 'Statues', type: 'statues' },
    { text: "Bougies & Parfums d'Intérieur", type: 'bougies-parfums-interieur' },
   //{ text: 'Porte-Bougies', type: 'porte-bougies' },
    { text: 'Linge de Maison', type: 'linge-de-maison' },
    { text: 'Cadres Photo', type: 'cadres-photo' },
    { text: 'Décorations Murales', type: 'decorations-murales' },
    { text: 'Plantes', type: 'plantes' }
  ],
  meuble: [
    { text: 'Salons', type: 'salons' },
    { text: 'Chambres', type: 'chambres' },
    { text: 'Salles à Manger', type: 'salles-a-manger' },
    { text: 'Canapés & Fauteuils', type: 'canapes-fauteuils' },
    { text: 'Meubles TV', type: 'meubles-tv' },
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
