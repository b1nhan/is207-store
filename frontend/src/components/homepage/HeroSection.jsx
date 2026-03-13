import './HeroSection.css';
import './HeroSection.css';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-[#182353] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-16 py-28">
        {/* LEFT */}
        <div className="space-y-6">
          <p className="text-2xl font-medium tracking-wide text-[#6b7db3]/60">
            IS207
          </p>

          <h1 className="text-7xl font-bold tracking-tight text-white">
            FASHION STORE
          </h1>

          <p className="text-base text-[#6b7db3]">Đồ đẹp vãi lz</p>

          <button className="rounded-md bg-[#3E79F3] px-10 py-4 font-medium text-white transition hover:bg-[#234ADE]">
            Mua Ngay
          </button>
        </div>

        {/* RIGHT */}
        <img
          src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
          alt="shirt"
          className="w-[380px]"
        />
      </div>
    </section>
  );
}

export function HeroSection2() {
  return (
    <section className="w-full bg-red-200">
      <div className="grid grid-cols-2">
        {/* LEFT BLOCK */}
        <div className="flex items-center justify-between bg-[#3E79F3] px-16 py-24 text-white">
          {/* IMAGE */}
          <img
            src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
            alt="shirt"
            className="w-[250px]"
          />

          {/* TEXT */}
          <div className="flex max-w-md flex-col items-center space-y-6 text-center">
            <h3 className="text-6xl leading-tight font-light tracking-tight text-white">
              Bộ sưu tập mới
            </h3>

            <p className="max-w-sm text-base leading-relaxed text-white/90">
              Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O
              will redefine your PlayStation experience.
            </p>

            <button className="rounded-lg bg-[#E6E9EF] px-12 py-4 font-medium text-[#3E79F3] transition hover:bg-white">
              Xem ngay
            </button>
          </div>
        </div>

        {/* RIGHT BLOCK */}
        <div className="flex items-center justify-between bg-[#DCE8FD] px-16 py-24">
          {/* TEXT */}
          <div className="max-w-md space-y-8">
            <div className="leading-none">
              <p className="text-5xl font-extralight text-[#1C2D5A]">Flash</p>

              <h3 className="-mt-1 text-7xl font-semibold text-[#1C2D5A]">
                Sale
              </h3>
            </div>

            <p className="text-lg leading-relaxed font-bold text-[#1C2D5A]/80">
              The new 15-inch MacBook Air makes room for more of what you love
              with a spacious Liquid Retina display.
            </p>

            <button className="rounded-lg bg-[#3E79F3] px-10 py-4 text-lg font-medium text-white transition hover:bg-[#234ADE]">
              Mua Ngay
            </button>
          </div>

          {/* COUNTDOWN */}
          <div className="flex flex-col items-center space-y-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3E79F3] text-xl font-bold text-white shadow-md"></div>

            <div className="flex flex-col items-center space-y-2">
              <div className="h-2 w-2 rounded-full bg-[#3E79F3]"></div>
              <div className="h-2 w-2 rounded-full bg-[#3E79F3]"></div>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3E79F3] text-xl font-bold text-white shadow-md">
              00
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="h-2 w-2 rounded-full bg-[#3E79F3]"></div>
              <div className="h-2 w-2 rounded-full bg-[#3E79F3]"></div>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3E79F3] text-xl font-bold text-white shadow-md">
              00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// import { Button } from "@/components/ui/button";

// export function ProductSection() {
//   return (

//   );
// }
