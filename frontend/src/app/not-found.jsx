import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Hình ảnh hoặc Icon minh họa (tùy chọn) */}
      <h1 className="text-9xl font-extrabold tracking-widest text-gray-200">
        404
      </h1>

      <div className="bg-primary absolute rotate-12 rounded px-2 text-sm">
        Trang không tồn tại
      </div>

      <div className="mt-5">
        <p className="mt-4 text-2xl font-semibold md:text-3xl">
          Rất tiếc! Chúng tôi không tìm thấy trang này.
        </p>
        <p className="mt-4 mb-8 text-gray-500">
          Có vẻ như đường dẫn đã bị hỏng hoặc trang đã được di chuyển.
        </p>

        {/* Nút quay lại trang chủ */}
        <Link
          href="/"
          className="rounded bg-black px-8 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
