const fs = require('fs');
const path = require('path');

const titles = {
  'app/(admin)/admin': 'Dashboard Admin',
  'app/(admin)/admin/brands': 'Quản lý Thương hiệu',
  'app/(admin)/admin/campaigns': 'Quản lý Chiến dịch',
  'app/(admin)/admin/campaigns/new': 'Thêm Chiến dịch',
  'app/(admin)/admin/campaigns/[id]': 'Chi tiết Chiến dịch',
  'app/(admin)/admin/categories': 'Quản lý Danh mục',
  'app/(admin)/admin/orders': 'Quản lý Đơn hàng',
  'app/(admin)/admin/orders/[id]': 'Chi tiết Đơn hàng',
  'app/(admin)/admin/products': 'Quản lý Sản phẩm',
  'app/(admin)/admin/products/new': 'Thêm Sản phẩm',
  'app/(admin)/admin/products/[id]': 'Chi tiết Sản phẩm',
  'app/(admin)/admin/products/[id]/edit': 'Sửa Sản phẩm',
  'app/(admin)/admin/vouchers': 'Quản lý Voucher',
  'app/(admin)/admin/vouchers/new': 'Thêm Voucher',
  'app/(shop)': 'Trang chủ',
  'app/(shop)/campaigns': 'Chiến dịch',
  'app/(shop)/campaigns/[id]': 'Chi tiết Chiến dịch',
  'app/(shop)/cart': 'Giỏ hàng',
  'app/(shop)/category': 'Danh mục',
  'app/(shop)/category/[slug]': 'Chi tiết Danh mục',
  'app/(shop)/checkout': 'Thanh toán',
  'app/(shop)/orders': 'Lịch sử Đơn hàng',
  'app/(shop)/orders/[id]': 'Chi tiết Đơn hàng',
  'app/(shop)/products': 'Sản phẩm',
  'app/(shop)/products/[id]': 'Chi tiết Sản phẩm',
  'app/(shop)/profile': 'Thông tin cá nhân',
  'app/(auth)/login': 'Đăng nhập',
  'app/(auth)/register': 'Đăng ký',
};

const baseDir = 'd:/myData/studio/code/web/IS207/frontend/src';

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name === 'page.jsx' || entry.name === 'page.tsx') {
      let relativePath = path.relative(baseDir, dir).replace(/\\/g, '/');
      
      const title = titles[relativePath] || 'Trang';
      
      const content = fs.readFileSync(fullPath, 'utf8');
      
      const hasMetadata = content.includes('export const metadata') || 
                          content.includes('export async function generateMetadata') ||
                          content.includes('export function generateMetadata');
                          
      if (!hasMetadata) {
        if (content.includes("'use client'") || content.includes('"use client"')) {
          // Client component -> create layout.jsx
          const layoutPath = path.join(dir, 'layout.jsx');
          if (!fs.existsSync(layoutPath)) {
            const layoutContent = "export const metadata = {\n  title: '" + title + "',\n};\n\nexport default function Layout({ children }) {\n  return <>{children}</>;\n}\n";
            fs.writeFileSync(layoutPath, layoutContent);
            console.log("Created layout.jsx for client page: " + relativePath);
          } else {
             // Layout exists, let's check if it has metadata
             const layoutContent = fs.readFileSync(layoutPath, 'utf8');
             if (!layoutContent.includes('export const metadata')) {
                const newLayoutContent = "export const metadata = {\n  title: '" + title + "',\n};\n\n" + layoutContent;
                fs.writeFileSync(layoutPath, newLayoutContent);
                console.log("Updated layout.jsx for client page: " + relativePath);
             }
          }
        } else {
          // Server component -> modify page.jsx
          
          // inject after imports
          const lines = content.split('\n');
          let lastImportIndex = -1;
          for (let i = 0; i < lines.length; i++) {
             if (lines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
             }
          }
          
          const metadataStr = "\nexport const metadata = {\n  title: '" + title + "',\n};\n";
          lines.splice(lastImportIndex + 1, 0, metadataStr);
          
          fs.writeFileSync(fullPath, lines.join('\n'));
          console.log("Added metadata to server page: " + relativePath);
        }
      }
    }
  }
}

processDirectory(path.join(baseDir, 'app'));
