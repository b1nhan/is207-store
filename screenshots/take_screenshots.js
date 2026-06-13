const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  
  // Create a function to easily take screenshots
  let counter = 1;
  const takeScreenshot = async (name) => {
    const fileName = `${String(counter).padStart(3, '0')}_${name}.png`;
    const filePath = path.join(__dirname, fileName);
    await wait(1000); // Wait for animations
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Saved ${fileName}`);
    counter++;
  };

  try {
    // --- USER FLOW ---
    // 1. Register
    await page.goto('http://localhost:3000/register');
    await takeScreenshot('feat_usr_auth_register_empty');
    
    await page.type('input[type="text"]', 'testuser');
    await page.type('input[type="email"]', 'testuser@example.com');
    await page.type('input[type="password"]', 'Atestuser123');
    // Assuming there is a confirm password field
    const inputs = await page.$$('input[type="password"]');
    if (inputs.length > 1) {
      await inputs[1].type('Atestuser123');
    }
    await takeScreenshot('feat_usr_auth_register_filled');

    // 2. Login
    await page.goto('http://localhost:3000/login');
    await takeScreenshot('feat_usr_auth_login_empty');
    
    await page.type('input[type="email"]', 'sukiakira1411@gmail.com');
    await page.type('input[type="password"]', 'Asukiakira1411@gmail.com');
    await takeScreenshot('feat_usr_auth_login_filled');
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // 3. Homepage (Logged in)
    await takeScreenshot('feat_usr_homepage');
    
    // 4. Profile
    await page.goto('http://localhost:3000/profile');
    await takeScreenshot('feat_usr_profile_view');

    // 5. Products
    await page.goto('http://localhost:3000/products');
    await takeScreenshot('feat_usr_prod_list');

    // 6. Categories
    await page.goto('http://localhost:3000/category');
    await takeScreenshot('feat_usr_cat_list');

    // 7. Cart
    await page.goto('http://localhost:3000/cart');
    await takeScreenshot('feat_usr_cart_manage');

    // 8. Campaigns
    await page.goto('http://localhost:3000/campaigns');
    await takeScreenshot('feat_usr_camp_view');

    // 9. Orders
    await page.goto('http://localhost:3000/orders');
    await takeScreenshot('feat_usr_ord_list');

    // Log out (we will just clear cookies/storage)
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');

    // --- ADMIN FLOW ---
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', '24520040@gm.uit.edu.vn');
    await page.type('input[type="password"]', 'A24520040@gm.uit.edu.vn');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // 10. Admin Dashboard
    await page.goto('http://localhost:3000/admin');
    await takeScreenshot('feat_adm_dash_view');

    // 11. Admin Products
    await page.goto('http://localhost:3000/admin/products');
    await takeScreenshot('feat_adm_prod_crud');

    // 12. Admin Orders
    await page.goto('http://localhost:3000/admin/orders');
    await takeScreenshot('feat_adm_ord_manage');

    // 13. Admin Vouchers
    await page.goto('http://localhost:3000/admin/vouchers');
    await takeScreenshot('feat_adm_vouch_crud');

    // 14. Admin Campaigns
    await page.goto('http://localhost:3000/admin/campaigns');
    await takeScreenshot('feat_adm_camp_crud');

    // 15. Admin Categories
    await page.goto('http://localhost:3000/admin/categories');
    await takeScreenshot('feat_adm_cat_crud');

    // 16. Admin Brands
    await page.goto('http://localhost:3000/admin/brands');
    await takeScreenshot('feat_adm_brand_crud');

  } catch (error) {
    console.error("Error during screenshots:", error);
  } finally {
    await browser.close();
  }
})();
