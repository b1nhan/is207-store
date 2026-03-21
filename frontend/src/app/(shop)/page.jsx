import { HeroSection } from '@/components/homepage/HeroSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import { ProductSection } from '@/components/homepage/ProductSection';
import { ProductFilter } from '@/components/product/ProductFilter';
export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection />
      <CategorySection />
      <ProductSection />
      <ProductFilter />
    </div>
  );
}
