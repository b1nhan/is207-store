import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductActions from '@/components/product/ProductActions';
import { formatCurrency } from '@/utils/currency';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await productService.getProduct(id);
    const product = res.data;
    return {
      title: `${product.product_name} | Cerulean Blue`,
      description: product.description || 'Chi tiết sản phẩm Cerulean Blue',
    };
  } catch (error) {
    return {
      title: 'Không tìm thấy sản phẩm',
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  let product = null;

  try {
    const res = await productService.getProduct(id);
    product = res.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const isSale = product.sale_price && product.sale_price < product.base_price;
  const displayPrice = product.sale_price || product.base_price;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image Gallery */}
        <div>
          <ProductImageGallery
            thumbnail={product.thumbnail}
            images={product.images}
          />
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-gray-100 pb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              {product.product_name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(displayPrice)}
              </span>
              {isSale && (
                <span className="text-xl text-text-muted line-through">
                  {formatCurrency(product.base_price)}
                </span>
              )}
            </div>
          </div>

          <div className="mb-8 prose prose-sm text-text-secondary max-w-none">
            {/* HTML description if it comes from rich text editor */}
            <div dangerouslySetInnerHTML={{ __html: product.description || 'Không có mô tả cho sản phẩm này.' }} />
          </div>

          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
