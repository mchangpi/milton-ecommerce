Hello, 我架設了電子商務網站 <br>
此網站使用的技術是 Node.js / Express.js / Sequelize ORM / EJS

1. 網站使用說明:<br>
使用者註冊並登入後 <br>
或使用測試帳號 test@gmail.com 密碼 12345<br>
a) 建立/更新產品 <br>
選擇導覽列的 "Add Product" / "Update Products" <br>
b) 加入產品至購物車 <br>
選擇導覽列的 "Shop"<br>
再選擇選購產品的 "Add to Cart"<br>
c) 從購物車下訂單<br>
選擇導覽列的 "Cart"<br>
再選擇 "Pay with ATM"<br>
即可至導覽列的 "Orders" 查看訂單<br>

2. 建立的資料庫表單有下述關係:<br>
Member has many Product<br>
Member has one Cart<br>
Member has many OrderMain<br>
Cart has many Product (with junction table: CartItem)<br>
OrderMain has many Product (with junction table: OrderSub)<br>

3. 程式架構說明:<br>
此網站的程式架構使用了 MVC 模型<br>
/models: 與資料庫相關程式，使用了 Sequelize ORM<br>
/views:  與使用者介面相關程式，使用了 EJS template<br>
/controllers: 與網站業務邏輯相關程式<br>
/routes: 與網站路由相關程式<br>

謝謝

Milton Chang (張志榮)<br>
Email: mchangpi@gmail.com<br>
Mobile: 0933-879-224
