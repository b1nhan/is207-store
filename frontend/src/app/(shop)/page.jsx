import { HeroSection } from '@/components/homepage/HeroSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import ProductSection from '@/components/homepage/ProductSection';

export default function HomePage() {
  const newArrivals = [
    {
      id: 1,
      name: 'Áo Thun Medusa Black',
      price: 36,
      image:
        'https://pundo.vn/wp-content/uploads/2025/10/ao-boy-pho-1-600x600.webp',
      material: '100% Cotton',
    },
    {
      id: 2,
      name: 'Quần Chino Slim Fit',
      price: 49,
      image:
        'https://tse3.mm.bing.net/th/id/OIP.MU5yeZO2ulos8aK99iZB3wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'Kaki',
    },
  ];

  const bestSellers = [
    {
      id: 3,
      name: 'Áo Hoodie Oversize',
      price: 89,
      image:
        'https://tse2.mm.bing.net/th/id/OIP.CIccJ5B8R6xbNc3Z_2fa9gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'Nỉ bông',
    },
  ];

  const featured = [
    {
      id: 4,
      name: 'Áo Khoác Puffer',
      price: 125,
      image:
        'https://tse2.mm.bing.net/th/id/OIP.1RMHEdnhTiH_GE593iwvdwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'Polyester',
    },
  ];
  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection />
      <CategorySection />
      <ProductSection
        newProduct={newArrivals}
        hotProduct={bestSellers}
        noibatProduct={featured}
      />
    </div>
  );
}
