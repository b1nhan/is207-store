import './HeroSection.css';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <>
      {/* code ở đây */}
      <div className="flex max-w-[200px] flex-col">
        <h2> Hero Section</h2>
        <div className="italic">demo sử dụng button</div>
        {/* Hí Hi làm thì xóa phần này đi nha */}
        <Button variant="outline">outline</Button>
        <Button variant="primary" size="lg">
          primary
        </Button>
        <Button variant="primary" size="xs">
          primary
        </Button>
        <Button variant="primary" size="icon-lg">
          hi
        </Button>
        <Button variant="secondary">secondary</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="destructive">destructive</Button>
        <Button variant="link">link</Button>
      </div>
    </>
  );
}
