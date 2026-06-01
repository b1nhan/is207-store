import { Suspense } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductGrid } from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
  title: 'Danh sách Sản phẩm | Cerulean Blue',
  description: 'Khám phá danh sách sản phẩm thời trang phong cách tại Cerulean Blue.',
};

export default async function ProductPage({ searchParams }) {
  const params = await searchParams;

  // Extract query parameters
  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const category = params.category || '';
  const minPrice = params.minPrice || '';
  const maxPrice = params.maxPrice || '';
  const sort = params.sort || 'newest';

  // Fetch data
  let products = [];
  let categories = [];
  let pagination = {};

  try {
    const fetchParams = {
      page,
      limit: 12,
      ...(search && { search }),
      ...(category && { category }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    };

    if (sort === 'price_asc') {
      fetchParams.sortBy = 'price';
      fetchParams.sortOrder = 'ASC';
    } else if (sort === 'price_desc') {
      fetchParams.sortBy = 'price';
      fetchParams.sortOrder = 'DESC';
    } else if (sort === 'newest' || sort === 'best_selling') {
      fetchParams.sortBy = 'createdAt';
      fetchParams.sortOrder = 'DESC';
    }

    const [productRes, categoryRes] = await Promise.allSettled([
      productService.getProducts(fetchParams),
      categoryService.getCategories(),
    ]);

    if (productRes.status === 'fulfilled') {
      products = productRes.value?.data?.items || [];
      pagination = productRes.value?.data?.pagination || {};
    }

    if (categoryRes.status === 'fulfilled') {
      categories = categoryRes.value?.data?.items || [];
    }
    console.log(products)
  } catch (error) {
    console.error('Error fetching data for products page:', error);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={[{ label: 'Sản phẩm' }]} className="mb-6" />
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {search ? `Kết quả tìm kiếm cho "${search}"` : 'Tất cả Sản phẩm'}
          </h1>
          <p className="mt-2 text-text-muted">
            {pagination.totalItems
              ? `Hiển thị ${products.length} trên tổng số ${pagination.totalItems} sản phẩm`
              : 'Đang tải sản phẩm...'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <div className="w-full shrink-0 md:w-64">
          <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg"></div>}>
            <ProductFilter categories={categories} />
          </Suspense>
        </div>

        {/* Product Grid & Pagination */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />

              {/* Basic Pagination Component */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    // generate href
                    const newParams = new URLSearchParams(params);
                    newParams.set('page', pageNum.toString());
                    return (
                      <a
                        key={pageNum}
                        href={`/products?${newParams.toString()}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border font-medium transition-all duration-200 ${isActive
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/30 border-gray-200'
                          }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-4xl text-gray-300">📦</div>
              <h3 className="text-xl font-semibold text-text-primary">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="mt-2 text-text-muted">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
