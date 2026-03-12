import { HeroSection } from '@/components/homepage/HeroSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import ProductSection from '@/components/homepage/ProductSection';

export default function HomePage() {
  const newArrivals = [
    {
      id: 1,
      name: 'Áo Thun hnk',
      price: 36,
      image:
        'https://tse4.mm.bing.net/th/id/OIP.bdoc7HBGYkzF39B6O5L33gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: '100% Cotton',
    },
    {
      id: 2,
      name: 'Quần sip hi hi',
      price: 49,
      image:
        'https://cdn.yousport.vn/Media/products/070326103845617/quan-ao-mikal-bamboo.jpg',
      material: 'Kaki',
    },
    {
      id: 3,
      name: 'Áo ba lỗ bảo nguyễn',
      price: 49,
      image:
        'https://tse1.mm.bing.net/th/id/OIP.npZbrV5-ETWtDx_j7bmA3QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'Kaki',
    },
    {
      id: 4,
      name: 'Áo ba lỗ bảo nguyễn',
      price: 49,
      image:
        'https://tse1.mm.bing.net/th/id/OIP.npZbrV5-ETWtDx_j7bmA3QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
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
  const discount = [
    {
      id: 5,
      name: 'Áo độ mixi',
      price: 120,
      image:
        'https://tse3.mm.bing.net/th/id/OIP.SsCwhAAxux2Kk9f5CJ5AsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'ba mia loai 2',
    },
    {
      id: 7,
      name: 'Áo độ mixi',
      price: 120,
      image:
        'https://tse3.mm.bing.net/th/id/OIP.SsCwhAAxux2Kk9f5CJ5AsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'ba mia loai 2',
    },
    {
      id: 6,
      name: 'Áo độ mixi',
      price: 120,
      image:
        'https://tse3.mm.bing.net/th/id/OIP.SsCwhAAxux2Kk9f5CJ5AsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'ba mia loai 2',
    },
    {
      id: 8,
      name: 'Áo độ mixi',
      price: 120,
      image:
        'https://tse3.mm.bing.net/th/id/OIP.SsCwhAAxux2Kk9f5CJ5AsQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
      material: 'ba mia loai 2',
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
        giamgia={discount}
      />
    </div>
  );
}
