import { HeroSection, HeroSection2 } from '@/components/homepage/HeroSection';
import { CategorySectionWrapper } from '@/components/homepage/CategorySectionWrapper';
import ProductSection from '@/components/homepage/ProductSection';
import { productService } from '@/services/productService';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default async function HomePage() {
  let newArrivals = [],
    bestSellers = [],
    featured = [],
    discount = [];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];

  try {
    // Fetch song song, nếu 1 cái lỗi không ảnh hưởng cái khác
    const [newRes, hotRes, featuredRes, discountRes] = await Promise.allSettled(
      [
        productService.getProducts({ sort: 'newest', limit: 5 }),
        productService.getProducts({ sort: 'best_selling', limit: 6 }),
        productService.getProducts({ is_featured: true, limit: 7 }),
        productService.getProducts({ on_sale: true, limit: 8 }),
      ],
    );
    // Lấy data nếu fulfilled, giữ [] nếu lỗi
    if (newRes.status === 'fulfilled')
      newArrivals = newRes.value?.data?.items ?? [];
    if (hotRes.status === 'fulfilled')
      bestSellers = hotRes.value?.data?.items ?? [];
    if (featuredRes.status === 'fulfilled')
      featured = featuredRes.value?.data?.items ?? [];
    if (discountRes.status === 'fulfilled')
      discount = discountRes.value?.data?.items ?? [];
  } catch (err) {
    console.error('Lỗi fetch homepage products:', err);
  }

  return (
    <div className="flex flex-col gap-16 pb-20">
      <Breadcrumbs items={breadcrumbItems} />
      <HeroSection />
      <CategorySectionWrapper />
      <HeroSection2 />
      <ProductSection
        newProduct={newArrivals}
        hotProduct={bestSellers}
        noibatProduct={featured}
        giamgia={discount}
      />
    </div>
  );
}
