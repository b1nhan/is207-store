import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductDetailClient from '@/components/productPage/productDetail';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { data } = await productService.getProduct(id);
    if (!data) return { title: 'Không tìm thấy sản phẩm' };

    return {
      title: `${data.product_name} | Shop-FS`,
      description: data.product_description,
    };
  } catch (error) {
    return { title: 'Lỗi tải trang' };
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
