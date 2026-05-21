import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductDetailClient from '@/components/productPage/productDetail';

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
  let relatedProducts = [];

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

  try {
    const relatedRes = await productService.getRelatedProducts(id, 6);
    relatedProducts = relatedRes.data || [];
  } catch (error) {
    console.warn('Could not fetch related products:', error);
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
