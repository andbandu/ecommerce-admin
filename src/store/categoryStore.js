import { create } from 'zustand';
import { fetchCategoriesFromService, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const categories = await fetchCategoriesFromService();
            set({ categories, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            set({ isLoading: false });
        }
    },

    // 2. Add Category
    addCategory: async (categoryData) => {
    set({ isLoading: true });   
    try {
      await createCategory(categoryData);
      get().fetchCategories(); 
    } catch (error) {
      console.error("Error adding category", error);
      set({ isLoading: false });
    }
  },

  // 3. Update Category
  editCategory: async (id, categoryData) => {
    set({ isLoading: true });
    try {
      await updateCategory(id, categoryData);
      get().fetchCategories();
    } catch (error) {
      console.error("Error updating category", error);
      set({ isLoading: false });
    }
  },

  // 4. Delete Category
  removeCategory: async (id) => {
    set({ isLoading: true });
    try {
      await deleteCategory(id);
      get().fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
      set({ isLoading: false });
    }
  }

}));