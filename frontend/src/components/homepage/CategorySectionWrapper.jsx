// CategorySectionWrapper.jsx
import { categoryService } from '@/services/categoryService';
import { CategorySection } from '@/components/category/CategorySection';

export async function CategorySectionWrapper() {
  let categories = [];
  try {
    const { data } = await categoryService.getCategories();
    categories = data?.items || [];
  } catch (error) {
    // Ignore error
  }

  return <CategorySection categories={categories} />;
}
