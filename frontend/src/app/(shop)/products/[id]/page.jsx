import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { campaignService } from '@/services/campaignService';
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
  let campaigns = [];

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

  // Fetch campaigns áp dụng cho sản phẩm này (related products được fetch client-side)
  const campaignRes = await campaignService
    .getActiveCampaigns({ product_id: id })
    .catch(() => null);

  if (campaignRes) {
    campaigns = campaignRes?.data || [];
  }

  return (
    <ProductDetailClient
      product={product}
      campaigns={campaigns}
    />
  );
}
