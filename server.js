// server.js

// 1. بارگیری متغیرهای محیطی (.env) و ماژول‌ها
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');

// 2. تنظیمات سرور
// پورت ۵۰۰۰ را از فایل .env می‌خواند
const PORT = process.env.PORT || 5000; 
const app = express();
app.use(express.json()); // برای پذیرش داده‌های JSON

// 3. تابع اتصال به دیتابیس (DB)
const connectDB = async () => {
    try {
        // اطلاعات کاربری که در MongoDB Atlas ثبت شده است
        const dbUser = 'taimaztokenofficial_db_user'; 
        // رمز عبور جدید و ساده که در Atlas تنظیم کردید (فرض شده: TaimazCode123)
        const dbPassword = 'TaimazCode123'; 
        
        // **رمزگذاری رمز عبور (حل مشکل bad auth)**
        const encodedPassword = encodeURIComponent(dbPassword);

        // ساخت رشته اتصال نهایی با رمز عبور رمزگذاری شده
        // کلاستر: taimaz.1oahcjt.mongodb.net
        const uri = `mongodb+srv://${dbUser}:${encodedPassword}@taimaz.1oahcjt.mongodb.net/webappdb?retryWrites=true&w=majority`;

        // اتصال به MongoDB
        await mongoose.connect(uri);
        console.log('✅ اتصال موفق به MongoDB!');
    } catch (error) {
        // در صورت عدم اتصال، خطا را نمایش داده و برنامه را متوقف می‌کند
        console.error('❌ خطا در اتصال به MongoDB:', error.message);
        process.exit(1); 
    }
};

// 4. تعریف یک مسیر تست ساده برای بررسی اجرای سرور
app.get('/', (req, res) => {
    res.status(200).json({
        message: '👋 Backend Server is Running!',
        // وضعیت اتصال به دیتابیس را نشان می‌دهد
        databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' 
    });
});

// 5. اتصال به دیتابیس و سپس راه‌اندازی سرور
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 سرور با موفقیت روی http://localhost:${PORT} در حال اجراست.`);
    });
});