import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductDetailClient from '@/components/productPage/productDetail';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

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
  try {
    // Gọi song song 2 API để tối ưu thời gian load
    const [productRes, relatedRes] = await Promise.all([
      productService.getProduct(id), // Đổi thành getProductBySlug(id) nếu dùng slug
      //   productService.getRelatedProducts(id, 4), // Lấy 4 sản phẩm tương tự
      productService.getProducts(),
    ]);

    if (!productRes || !productRes.success || !productRes.data) {
      return notFound();
    }

    const product = productRes.data;
    const relatedProducts = relatedRes?.data?.items || relatedRes?.data || [];
    // ^ Tuỳ thuộc vào cấu trúc trả về của mảng related products

    return (
      <main className="bg-background min-h-screen">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>
    );
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu trang sản phẩm:', error);
    return notFound();
  }
}
