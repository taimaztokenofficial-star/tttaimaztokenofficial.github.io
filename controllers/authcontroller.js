// Controllers (or authController.js)

const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

// مسیر ثبت نام (Register Route)
exports.register = async (req, res) => {
    // دریافت اطلاعات کاربر از بدنه درخواست (req.body)
    const { username, email, password } = req.body;
    try {
        // بررسی وجود کاربر تکراری (هم نام کاربری و هم ایمیل)
        const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (existingUser) {
            return res.status(400).send("کاربر با این نام کاربری یا ایمیل قبلاً ثبت نام کرده است.");
        }
        
        // ایجاد و ذخیره کاربر جدید (رمز عبور به صورت خودکار توسط مدل User هش می شود)
        const newUser = new User({ username, email, password });
        await newUser.save();
        
        res.status(201).send("ثبت نام موفقیت‌آمیز بود.");
    } catch (error) {
        console.error("خطا در ثبت نام:", error);
        res.status(500).send("خطای داخلی سرور هنگام ثبت نام.");
    }
};

// مسیر ورود (Login Route)
exports.login = async (req, res) => {
    // دریافت ایمیل و رمز عبور از بدنه درخواست
    const { email, password } = req.body;
    try {
        // پیدا کردن کاربر با ایمیل
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("کاربر با این ایمیل یافت نشد.");
        }
        
        // مقایسه رمز عبور وارد شده با رمز عبور هش شده در دیتابیس
        const isMatch = await user.comparePassword(password); // این تابع در مدل User تعریف شده است
        if (!isMatch) {
            return res.status(401).send("رمز عبور نامعتبر است.");
        }
        
        // ایجاد توکن JWT برای احراز هویت (Authentication)
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, // کلید مخفی از فایل .env
            { expiresIn: '1h' }     // انقضای توکن پس از 1 ساعت
        );

        res.status(200).json({ 
            message: "ورود موفق!", 
            token: token, 
            user: { id: user._id, username: user.username }
        });

    } catch (error) {
        console.error("خطا در ورود:", error);
        res.status(500).send("خطای داخلی سرور هنگام ورود.");
    }
};
