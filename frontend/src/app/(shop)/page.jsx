import { HeroSection, HeroSection2 } from '@/components/homepage/HeroSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import { ProductSection } from '@/components/homepage/ProductSection';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection />
      <CategorySection />
      <HeroSection2 />
      <ProductSection />
    </div>
  );
}
