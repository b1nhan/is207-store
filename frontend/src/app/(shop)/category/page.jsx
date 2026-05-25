import { categoryService } from '@/services/categoryService';
import { CategorySection } from '@/components/category/CategorySection';

export const metadata = {
  title: 'Danh mục Sản phẩm | Cerulean Blue',
  description: 'Tất cả danh mục sản phẩm tại Cerulean Blue.',
};

export default async function CategoryPage() {
  let categories = [];
  try {
    const res = await categoryService.getCategories();
    categories = res?.data?.items || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-12 text-3xl font-bold text-text-primary text-center">
        Danh Mục Sản Phẩm
      </h1>
      {categories.length > 0 ? (
        <CategorySection categories={categories} isGrid={true} hideHeader={true} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-4xl text-gray-300">📦</div>
          <h3 className="text-xl font-semibold text-text-primary">
            Chưa có danh mục nào
          </h3>
        </div>
      )}
    </div>
  );
}
