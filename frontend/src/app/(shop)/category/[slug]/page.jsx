import { Suspense } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { ProductGrid } from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Danh mục ${slug} | Cerulean Blue`,
  };
}

export default async function CategorySlugPage({ params, searchParams }) {
  const { slug } = await params;
  const searchParamsAwaited = await searchParams;

  const page = parseInt(searchParamsAwaited.page || '1', 10);
  const minPrice = searchParamsAwaited.minPrice || '';
  const maxPrice = searchParamsAwaited.maxPrice || '';
  const sort = searchParamsAwaited.sort || 'newest';

  let products = [];
  let categories = [];
  let pagination = {};
  let categoryName = slug;
  let hasError = false;

  try {
    const fetchParams = {
      page,
      limit: 12,
      category: slug,
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
    } else {
      hasError = true;
    }

    if (categoryRes.status === 'fulfilled') {
      categories = categoryRes.value?.data?.items || [];
      const currentCat = categories.find(c => (c.slug || c.category_id?.toString()) === slug);
      if (currentCat) {
        categoryName = currentCat.category_name || currentCat.name;
      }
    }
  } catch (error) {
    console.error('Error fetching data for category page:', error);
    hasError = true;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-primary capitalize">
            Danh mục: {categoryName}
          </h1>
          <p className="mt-2 text-text-muted">
            {pagination.totalItems !== undefined
              ? `Hiển thị ${products.length} trên tổng số ${pagination.totalItems} sản phẩm`
              : hasError ? 'Không thể tải danh sách sản phẩm' : 'Đang tải sản phẩm...'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <div className="w-full shrink-0 md:w-64">
          <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-100 rounded-lg"></div>}>
            <ProductFilter has_categories={false} />
          </Suspense>
        </div>

        {/* Product Grid & Pagination */}
        <div className="flex-1">
          {hasError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-4xl text-red-500">⚠️</div>
              <h3 className="text-xl font-semibold text-text-primary">
                Đã xảy ra lỗi
              </h3>
              <p className="mt-2 text-text-muted">
                Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />

              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === page;
                    const newParams = new URLSearchParams(searchParamsAwaited);
                    newParams.set('page', pageNum.toString());
                    return (
                      <a
                        key={pageNum}
                        href={`/category/${slug}?${newParams.toString()}`}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border font-medium transition-colors ${isActive
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-text-primary hover:bg-gray-50 border-gray-200'
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
                Danh mục này hiện tại chưa có sản phẩm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
