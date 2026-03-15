import './HeroSection.css';
import './HeroSection.css';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="bg-cb-950 flex h-[632px] items-center overflow-hidden text-white">
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-shrink-0 items-center justify-between px-16 py-0">
        <div className="flex-shrink-0 space-y-6">
          <p className="text-text-muted text-[25px] leading-[32px] font-semibold">
            IS207
          </p>

          <h1 className="text-8xl font-bold tracking-tight text-white">
            FASHION STORE
          </h1>

          <p className="text-text-muted max-w-[714px] text-[18px] leading-[24px] font-semibold">
            Đồ đẹp vãi lz
          </p>

          <Button variant="primary" size="xl">
            Mua ngay
          </Button>
        </div>

        <div className="h-[622px] w-[622px] flex-shrink-0 translate-x-[70px] translate-y-[130px]">
          <img
            src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
            alt="shirt"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

export function HeroSection2() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2">
        <div className="bg-cb-500 flex items-center justify-between px-16 py-16 text-white">
          <img
            src="https://res.cloudinary.com/dlefkbf8l/image/upload/v1773366222/ao-cho-la-ban-khong-phai-toi.png"
            alt="shirt"
            className="h-[420px] w-[380px] -translate-x-[10px] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.35)]"
          />

          <div className="flex min-w-[400px] translate-x-[-50px] flex-col items-end space-y-6 pr-2 text-right">
            <h3 className="text-5xl font-bold text-white">Bộ sưu tập mới</h3>

            <p className="text-cb-50 w-[282px] text-[15px] leading-[24px] font-medium">
              Những item cực cháy vừa cập bến. Thiết kế độc quyền giúp bạn tự
              tin khẳng định chất riêng không đụng hàng.
            </p>

            <Button variant="secondary" size="xl">
              Xem ngay
            </Button>
          </div>
        </div>

        <div className="bg-secondary flex items-center justify-between px-16 py-16">
          <div className="max-w-md space-y-8">
            <div className="leading-none">
              <p className="text-text-primary text-5xl font-extralight">
                Flash
              </p>
              <h3 className="text-text-primary -mt-1 text-7xl font-semibold">
                Sale
              </h3>
            </div>

            <p className="text-text-primary/80 text-lg leading-relaxed font-bold">
              Giảm giá sập sàn toàn bộ item hot hit. Áp dụng trong thời gian đếm
              ngược, nhanh tay chốt đơn kẻo lỡ size nhé!
            </p>

            <Button variant="primary" size="xl">
              Xem ngay
            </Button>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="bg-cb-500 flex h-18 w-18 items-center justify-center rounded-[10px] text-xl font-bold text-white shadow-md">
              00
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="bg-cb-500 h-2 w-2 rounded-full"></div>
              <div className="bg-cb-500 h-2 w-2 rounded-full"></div>
            </div>

            <div className="bg-cb-500 flex h-18 w-18 items-center justify-center rounded-[10px] text-xl font-bold text-white shadow-md">
              00
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="bg-cb-500 h-2 w-2 rounded-full"></div>
              <div className="bg-cb-500 h-2 w-2 rounded-full"></div>
            </div>

            <div className="bg-cb-500 flex h-18 w-18 items-center justify-center rounded-[10px] text-xl font-bold text-white shadow-md">
              00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
