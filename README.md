# mxh-cnweb
- viết định tuyến tại thư mục route, truy suất mongodb tại thư mục service, các hàm middleware tại controller
- cấu trúc các thành phần tại models, chưa triển khai: PostLike, Followings, Comments, CommentLikes
- thư mục routes/auth: chứa xử lý và định tuyến xác thực bằng fb, gg, tk mk
- đăng ký user: Sigup.js
-Route chung: routes/index.js
- file .env: chứa cấu hình xác thực fb, gg và kết nối mongodb
- các api:
+ https://localhost:8080/auth/password   POST: {"user_email":"<email>", "user_password": "<password>"}  (đăng nhập truyền thống)
+ https://localhost:8080/signup   POST: {các thông tin} (đăng kí)
+ https://localhost:8080/logined  GET: kiểm tra trạng thái đăng nhập
+ https://localhost:8080/logout  GET: đăng xuất
+ /users/myinfo  GET: lấy thông tin người dùng hiện tại
+ /users/:id   GET: lấy thông tin user theo id, PUT: update user
+/users/search?search="<từ khóa cần search>"  GET: tìm user theo tên, email
+ xem thêm tại routes/index.js
- Thư mục key: chứa khóa private và public để tạo https
- các chức năng hiện tại: thêm sửa xóa post, thêm sửa thông tin, kết bạn, thông báo kết bạn