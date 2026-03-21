import { brandService } from '@/services/brandService';
export async function ProductGridSection() {
  const { data } = await brandService.getBrand();
  console.log(data);
  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold">Brands List</h1>
      <ul className="mt-4">
        {data.items.map((brand) => (
          <li key={brand.brand_id} className="border-b py-1">
            {brand.brand_name}
            <span className="ml-2 text-gray-500">({brand.product_count})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
