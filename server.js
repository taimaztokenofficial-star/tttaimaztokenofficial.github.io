const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// اتصال به فایل‌های گرافیکی (پوشه public)
app.use(express.static(path.join(__dirname, 'public')));

// تنظیمات دیتابیس
mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://taimaztokenofficial:Taimaz1363@cluster0.mongodb.net/myDatabase')
    .then(() => console.log('اتصال موفق به MongoDB!'))
    .catch(err => console.error('Database Connection Error:', err));

// *تنها مسیر اصلی پروژه برای اجرای داشبورد*
// کدهای تکراری قبلی کاملاً حذف شدند تا صفحه سفید نباشد
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
