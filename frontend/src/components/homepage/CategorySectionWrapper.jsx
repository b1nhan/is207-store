// CategorySectionWrapper.jsx
import { categoryService } from '@/services/categoryService';
import { CategorySection } from '@/components/category/CategorySection';

export async function CategorySectionWrapper() {
  const { data } = await categoryService.getCategories();
  return <CategorySection categories={data.items} />;
}
