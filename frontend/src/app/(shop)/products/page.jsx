import SearchBar from '@/components/layout/SearchBar';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function ProductPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      <Breadcrumbs items={breadcrumbItems} />
      <h1>Product Page</h1>
      <SearchBar />
    </div>
  );
}
