// src/services/categoryService.js

export let INITIAL_CATEGORIES = [ 
  {
    id: 'CAT-1',
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    parent: 'None (Top Level)',
    description: 'Smartphones, premium headphones, laptops, and smart home appliances.',
    productCount: 142,
    order: 1,
    status: 'Active',
    color: '#1e40af', // Deep blue
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'CAT-2',
    name: 'Apparel & Clothing',
    slug: 'apparel-clothing',
    parent: 'None (Top Level)',
    description: 'Men & women outerwear, athletic apparel, designer jackets, and loungewear.',
    productCount: 218,
    order: 2,
    status: 'Active',
    color: '#6366f1', // Indigo
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'CAT-3',
    name: 'Wearables & Smart Tech',
    slug: 'wearables-smart-tech',
    parent: 'Electronics & Gadgets',
    description: 'Fitness trackers, luxury smartwatches, and wireless biometric sensors.',
    productCount: 64,
    order: 3,
    status: 'Active',
    color: '#0284c7', // Sky blue
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'CAT-4',
    name: 'Footwear & Athletic',
    slug: 'footwear-athletic',
    parent: 'None (Top Level)',
    description: 'Running shoes, casual sneakers, boots, and training sports gear.',
    productCount: 95,
    order: 4,
    status: 'Active',
    color: '#10b981', // Emerald
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'CAT-5',
    name: 'Workplace & Accessories',
    slug: 'workplace-accessories',
    parent: 'None (Top Level)',
    description: 'Minimalist leather desk pads, carry backpacks, cable organizers, and stands.',
    productCount: 88,
    order: 5,
    status: 'Active',
    color: '#f59e0b', // Amber
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'CAT-6',
    name: 'Home & Kitchen Decor',
    slug: 'home-kitchen',
    parent: 'None (Top Level)',
    description: 'Modern cookware, aesthetic ceramic tableware, and living room organizers.',
    productCount: 41,
    order: 6,
    status: 'Hidden',
    color: '#8b5cf6', // Violet
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=200&q=80',
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCategoriesFromService = async () => {
  // මෙතනදී ඇත්තටම axios.get('/api/categories') වගේ දෙයක් පාවිච්චි කරන්න පුළුවන්.
  return INITIAL_CATEGORIES;
};

export const createCategory = async (categoryData) => {
  await delay(500);
  const newCategory = { ...categoryData, id: Date.now() };
  INITIAL_CATEGORIES = [...INITIAL_CATEGORIES, newCategory];
  return { data: newCategory };
};

export const updateCategory = async (id, categoryData) => {
  await delay(500);
  INITIAL_CATEGORIES = INITIAL_CATEGORIES.map((cat) => 
    cat.id === id ? { ...categoryData, id } : cat
  );
  return { data: categoryData };
};

export const deleteCategory = async (id) => {
  await delay(500);
  INITIAL_CATEGORIES = INITIAL_CATEGORIES.filter((cat) => cat.id !== id);
  return { data: { message: "Deleted successfully" } };
};