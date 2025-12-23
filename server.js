const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// میان‌افزارها
app.use(cors());
app.use(express.json());

// اتصال به فایل‌های گرافیکی در پوشه public
app.use(express.static(path.join(__dirname, 'public')));

// تنظیمات دیتابیس
const mongoURI = process.env.MONGO_URL || 'mongodb+srv://taimaztokenofficial:Taimaz1363@cluster0.mongodb.net/myDatabase';
mongoose.connect(mongoURI)
    .then(() => console.log('اتصال موفق به MongoDB!'))
    .catch(err => console.error('Database Connection Error:', err));

// --- بخش اصلاح شده برای اجرای داشبورد ---
// این خط تمام درخواست‌ها را به فایل گرافیکی اصلی هدایت می‌کند
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تنظیم پورت سرور
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});