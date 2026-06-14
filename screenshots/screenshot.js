const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const OUTPUT_DIR = path.join(__dirname, 'output');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();

  let counter = 1;
  const takeScreenshot = async (id, filename) => {
    const filePath = path.join(OUTPUT_DIR, `${String(counter).padStart(3, '0')}_${filename}`);
    await wait(1000); // Wait for animations and stable rendering
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`Saved ${filename} at ${filePath}`);
    counter++;
  };

  const safeExecute = async (featureName, action) => {
    console.log(`Starting: ${featureName}`);
    try {
      await action();
    } catch (error) {
      console.error(`Error during ${featureName}:`, error.message);
    }
  };

  try {
    // --- USER FLOW ---
    
    // [feat_usr_homepage] — Trang chủ
    await safeExecute('feat_usr_homepage', async () => {
      await page.goto('http://localhost:3000/');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_homepage', 'feat_usr_homepage.png');
    });

    // [feat_usr_auth_register_empty] — Đăng ký tài khoản (trống)
    await safeExecute('feat_usr_auth_register_empty', async () => {
      await page.goto('http://localhost:3000/register');
      await page.waitForSelector('form');
      await takeScreenshot('feat_usr_auth_register_empty', 'feat_usr_auth_register_empty.png');
    });

    // [feat_usr_auth_register_filled] — Đăng ký tài khoản (đã điền)
    await safeExecute('feat_usr_auth_register_filled', async () => {
      const inputs = await page.$$('input[type="text"]');
      if (inputs.length > 0) await inputs[0].type('testuser'); // username
      if (inputs.length > 1) await inputs[1].type('Test User'); // full name

      await page.type('input[type="email"]', 'testuser@example.com');
      await page.type('input[type="tel"]', '0123456789');

      const pwdInputs = await page.$$('input[type="password"]');
      if (pwdInputs.length > 0) await pwdInputs[0].type('Atestuser123');
      if (pwdInputs.length > 1) await pwdInputs[1].type('Atestuser123');

      await takeScreenshot('feat_usr_auth_register_filled', 'feat_usr_auth_register_filled.png');
    });

    // [feat_usr_auth_login_empty] — Đăng nhập (trống)
    await safeExecute('feat_usr_auth_login_empty', async () => {
      await page.goto('http://localhost:3000/login');
      await page.waitForSelector('form');
      await takeScreenshot('feat_usr_auth_login_empty', 'feat_usr_auth_login_empty.png');
    });

    // [feat_usr_auth_login_filled] — Đăng nhập (đã điền)
    await safeExecute('feat_usr_auth_login_filled', async () => {
      await page.type('input[type="email"]', 'sukiakira1411@gmail.com');
      await page.type('input[type="password"]', 'Asukiakira1411@gmail.com');
      await takeScreenshot('feat_usr_auth_login_filled', 'feat_usr_auth_login_filled.png');
      
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    // [feat_usr_profile_view] — Xem thông tin cá nhân
    await safeExecute('feat_usr_profile_view', async () => {
      await page.goto('http://localhost:3000/profile');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_profile_view', 'feat_usr_profile_view.png');
    });

    // [feat_usr_profile_update_modal]
    await safeExecute('feat_usr_profile_update_modal', async () => {
      await page.click('#open-edit-profile-btn');
      await wait(500);
      await takeScreenshot('feat_usr_profile_update_modal', 'feat_usr_profile_update_modal.png');
      await page.keyboard.press('Escape');
      await wait(500);
    });

    // [feat_usr_change_password_modal]
    await safeExecute('feat_usr_change_password_modal', async () => {
      await page.click('#open-change-password-btn');
      await wait(500);
      await takeScreenshot('feat_usr_change_password_modal', 'feat_usr_change_password_modal.png');
      await page.keyboard.press('Escape');
      await wait(500);
    });

    // [feat_usr_shipping_modal]
    await safeExecute('feat_usr_shipping_modal', async () => {
      const [addBtn] = await page.$x("//button[contains(., 'Thêm địa chỉ')]");
      if (addBtn) {
        await addBtn.click();
        await wait(500);
        await takeScreenshot('feat_usr_shipping_modal', 'feat_usr_shipping_modal.png');
        await page.keyboard.press('Escape');
        await wait(500);
      }
    });

    // [feat_usr_search]
    await safeExecute('feat_usr_search', async () => {
      await page.goto('http://localhost:3000/');
      await page.waitForNetworkIdle();
      await page.type('input[type="search"]', 'áo');
      await page.waitForSelector('#search-dropdown', { visible: true });
      await wait(500);
      await takeScreenshot('feat_usr_search', 'feat_usr_search.png');
    });

    // [feat_usr_homepage_scroll]
    await safeExecute('feat_usr_homepage_scroll', async () => {
      await page.goto('http://localhost:3000/');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_homepage_hero', 'feat_usr_homepage_hero.png');
      await page.evaluate(() => window.scrollBy(0, 800));
      await wait(1000);
      await takeScreenshot('feat_usr_homepage_new_arrivals', 'feat_usr_homepage_new_arrivals.png');
      await page.evaluate(() => window.scrollBy(0, 800));
      await wait(1000);
      await takeScreenshot('feat_usr_homepage_best_sellers', 'feat_usr_homepage_best_sellers.png');
    });

    // [feat_usr_prod_list] — Danh sách sản phẩm
    await safeExecute('feat_usr_prod_list', async () => {
      await page.goto('http://localhost:3000/products');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_prod_list', 'feat_usr_prod_list.png');
    });

    // [feat_usr_prod_detail] & [feat_usr_cart_with_items] & [feat_usr_checkout]
    await safeExecute('feat_usr_prod_detail_and_cart', async () => {
      await page.goto('http://localhost:3000/products');
      await page.waitForNetworkIdle();
      
      const productLinks = await page.$$('a[href^="/products/"]');
      if (productLinks.length > 0) {
        // Go to first product
        const href = await page.evaluate(el => el.getAttribute('href'), productLinks[0]);
        await page.goto(`http://localhost:3000${href}`);
        await page.waitForNetworkIdle();
        await takeScreenshot('feat_usr_prod_detail', 'feat_usr_prod_detail.png');

        // Thêm vào giỏ
        const [addToCartBtn] = await page.$x("//button[contains(., 'Thêm vào giỏ hàng')]");
        if (addToCartBtn) {
          await addToCartBtn.click();
          await wait(1000);
        }

        await page.goto('http://localhost:3000/cart');
        await page.waitForNetworkIdle();
        await takeScreenshot('feat_usr_cart_with_items', 'feat_usr_cart_with_items.png');

        await page.goto('http://localhost:3000/checkout');
        await page.waitForNetworkIdle();
        await takeScreenshot('feat_usr_checkout', 'feat_usr_checkout.png');
      }
    });

    // [feat_usr_cat_list] — Danh sách danh mục
    await safeExecute('feat_usr_cat_list', async () => {
      await page.goto('http://localhost:3000/category');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_cat_list', 'feat_usr_cat_list.png');
    });

    // [feat_usr_cart_manage] — Giỏ hàng
    await safeExecute('feat_usr_cart_manage', async () => {
      await page.goto('http://localhost:3000/cart');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_cart_manage', 'feat_usr_cart_manage.png');
    });

    // [feat_usr_ord_list] — Danh sách đơn hàng
    await safeExecute('feat_usr_ord_list', async () => {
      await page.goto('http://localhost:3000/orders');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_ord_list', 'feat_usr_ord_list.png');
    });

    // [feat_usr_ord_detail]
    await safeExecute('feat_usr_ord_detail', async () => {
      await page.goto('http://localhost:3000/orders');
      await page.waitForNetworkIdle();
      const orderLinks = await page.$$('a[href^="/orders/"]');
      if (orderLinks.length > 0) {
        const href = await page.evaluate(el => el.getAttribute('href'), orderLinks[0]);
        await page.goto(`http://localhost:3000${href}`);
        await page.waitForNetworkIdle();
        await takeScreenshot('feat_usr_ord_detail', 'feat_usr_ord_detail.png');
      }
    });

    // [feat_usr_camp_view] — Danh sách campaigns
    await safeExecute('feat_usr_camp_view', async () => {
      await page.goto('http://localhost:3000/campaigns');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_usr_camp_view', 'feat_usr_camp_view.png');
    });

    // [feat_usr_camp_detail]
    await safeExecute('feat_usr_camp_detail', async () => {
      await page.goto('http://localhost:3000/campaigns');
      await page.waitForNetworkIdle();
      const campLinks = await page.$$('a[href^="/campaigns/"]');
      if (campLinks.length > 0) {
        const href = await page.evaluate(el => el.getAttribute('href'), campLinks[0]);
        await page.goto(`http://localhost:3000${href}`);
        await page.waitForNetworkIdle();
        await takeScreenshot('feat_usr_camp_detail', 'feat_usr_camp_detail.png');
      }
    });

    // Logout
    await safeExecute('logout_user', async () => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      const client = await page.target().createCDPSession();
      await client.send('Network.clearBrowserCookies');
    });

    // --- ADMIN FLOW ---
    
    await safeExecute('login_admin', async () => {
      await page.goto('http://localhost:3000/login');
      await page.waitForSelector('form');
      await page.type('input[type="email"]', '24520040@gm.uit.edu.vn');
      await page.type('input[type="password"]', 'A24520040@gm.uit.edu.vn');
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    });

    // [feat_adm_dash_view] — Admin Dashboard
    await safeExecute('feat_adm_dash_view', async () => {
      await page.goto('http://localhost:3000/admin');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_dash_view', 'feat_adm_dash_view.png');
    });

    // [feat_adm_prod_crud] — Danh sách sản phẩm
    await safeExecute('feat_adm_prod_crud', async () => {
      await page.goto('http://localhost:3000/admin/products');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_prod_crud', 'feat_adm_prod_crud.png');
    });

    // [feat_adm_prod_create_modal]
    await safeExecute('feat_adm_prod_create_modal', async () => {
      const [createBtn] = await page.$x("//button[contains(., 'Thêm Sản phẩm')]");
      if (createBtn) {
        await createBtn.click();
        await wait(1000);
        await takeScreenshot('feat_adm_prod_create_modal', 'feat_adm_prod_create_modal.png');
        await page.keyboard.press('Escape');
        await wait(500);
      }
    });

    // [feat_adm_ord_manage] — Danh sách đơn hàng
    await safeExecute('feat_adm_ord_manage', async () => {
      await page.goto('http://localhost:3000/admin/orders');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_ord_manage', 'feat_adm_ord_manage.png');
    });

    // [feat_adm_ord_detail_modal]
    await safeExecute('feat_adm_ord_detail_modal', async () => {
      const [viewBtn] = await page.$x("//button[contains(., 'Xem')]");
      if (viewBtn) {
        await viewBtn.click();
        await wait(1000);
        await takeScreenshot('feat_adm_ord_detail_modal', 'feat_adm_ord_detail_modal.png');
        await page.keyboard.press('Escape');
        await wait(500);
      }
    });

    // [feat_adm_vouch_crud] — Danh sách voucher
    await safeExecute('feat_adm_vouch_crud', async () => {
      await page.goto('http://localhost:3000/admin/vouchers');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_vouch_crud', 'feat_adm_vouch_crud.png');
    });

    // [feat_adm_vouch_create]
    await safeExecute('feat_adm_vouch_create', async () => {
      await page.goto('http://localhost:3000/admin/vouchers/new');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_vouch_create_modal', 'feat_adm_vouch_create_modal.png');
    });

    // [feat_adm_camp_crud] — Danh sách campaign
    await safeExecute('feat_adm_camp_crud', async () => {
      await page.goto('http://localhost:3000/admin/campaigns');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_camp_crud', 'feat_adm_camp_crud.png');
    });

    // [feat_adm_camp_create]
    await safeExecute('feat_adm_camp_create', async () => {
      await page.goto('http://localhost:3000/admin/campaigns/new');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_camp_create_modal', 'feat_adm_camp_create_modal.png');
    });

    // [feat_adm_cat_crud] — Danh sách danh mục
    await safeExecute('feat_adm_cat_crud', async () => {
      await page.goto('http://localhost:3000/admin/categories');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_cat_crud', 'feat_adm_cat_crud.png');
    });

    // [feat_adm_cat_create_modal]
    await safeExecute('feat_adm_cat_create_modal', async () => {
      const [createBtn] = await page.$x("//button[contains(., 'Tạo danh mục')]");
      if (createBtn) {
        await createBtn.click();
        await wait(500);
        await takeScreenshot('feat_adm_cat_create_modal', 'feat_adm_cat_create_modal.png');
        await page.keyboard.press('Escape');
        await wait(500);
      }
    });

    // [feat_adm_brand_crud] — Danh sách thương hiệu
    await safeExecute('feat_adm_brand_crud', async () => {
      await page.goto('http://localhost:3000/admin/brands');
      await page.waitForNetworkIdle();
      await takeScreenshot('feat_adm_brand_crud', 'feat_adm_brand_crud.png');
    });

    // [feat_adm_brand_create_modal]
    await safeExecute('feat_adm_brand_create_modal', async () => {
      const [createBtn] = await page.$x("//button[contains(., 'Tạo Brand')]");
      if (createBtn) {
        await createBtn.click();
        await wait(500);
        await takeScreenshot('feat_adm_brand_create_modal', 'feat_adm_brand_create_modal.png');
        await page.keyboard.press('Escape');
        await wait(500);
      }
    });

  } catch (error) {
    console.error('Critical error during automation:', error);
  } finally {
    await browser.close();
  }
})();
