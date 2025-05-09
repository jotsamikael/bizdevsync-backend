📦 BizdevSync – Backend API
BizdevSync is a SaaS platform that streamlines business development workflows. This backend provides secure APIs for user management, lead tracking, activation flows, and more.

🛠️ Tech Stack
Node.js + Express – Backend framework

Sequelize ORM – DB modeling (MySQL/SQLite/Postgre)

JWT – Authentication

Nodemailer – Email activation

CORS, Helmet, Cookie-parser – Security & middleware

📁 Project Structure
bash
Copy
Edit
/config            -> DB and environment config  
/controllers       -> Route logic and business rules  
/models            -> Sequelize models  
/routes            -> API route declarations  
/services          -> External services (mail, etc.)  
/utils             -> Helpers (activation code generator, validation)  
/middleware        -> Error handling, auth middleware  

🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-org/bizdevsync-backend.git
cd bizdevsync-backend
2. Install Dependencies
npm install

3. Create .env File
Create a .env in the root with:

env
Copy

PORT=8885
DATABASE=bizdevsync
USER=root
PASSWORD=yourpassword
HOST=localhost
DIALECT=mysql
PORT_DATABASE=3306

TOKEN=your_jwt_secret
EMAIL_USER=xxxxxxx
EMAIL_PASS=xxxxxxx
4. Start Development Server
bash
Copy
Edit
npm start
Server runs on:
👉 http://localhost:8885

✅ Features
🔐 JWT-based Authentication (Signup/Login) ✅
    Image upload on signup ✅

📩 Account Activation via Email (4-digit code) ✅

🧑‍💼 Role-based Access (solo biz dev, enterprise admin, operator) ✅

🔄 Pagination, Filtering, Error handling ✅
    Password reset feature ✅
    Subscription Plans ✅
    Order plan ✅
    Subscription expiry ✅

📊 Lead, Business, Follow-up Management ... coming soon

🌍 Country & Product Category support

🛡️ Security Headers & CORS protection

📫 Activation Flow
New user signs up

Receives a 4-digit code via email

Hits /activate-account with code

Account is marked is_activated = true

📦 Available Scripts

Script	Description
npm start	Run production server
npm run dev	Run server with nodemon
npm run test	(optional) Run tests (Jest)
🧪 Example API Endpoints

Method	Endpoint	Description
POST	/signup	Register new user
POST	/signin	Login and receive JWT + cookie
POST	/activate-account	Submit activation code
GET	/get-user-by-email	Find user by email
GET	/leads, /business	Business resources

📖 Future Improvements
📆 Google Calendar & Meet integration

📦 Swagger API documentation

⏳ Cron jobs to expire unused activation codes 

🛎️ Notifications & email templates

👨‍💻 Contributors
@jotsamikael

