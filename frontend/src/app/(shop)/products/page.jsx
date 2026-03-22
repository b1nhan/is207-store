import SearchBar from '@/components/layout/SearchBar';
import ProductFilter from '@/components/product/ProductFilter';
export default function ProductPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <h1>Product Page</h1>
      <SearchBar />
      <ProductFilter />
    </div>
  );
}
