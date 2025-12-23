document.addEventListener('DOMContentLoaded', () => {
    // 1. تعریف متغیرهای اصلی (فرم‌ها و دکمه‌ها)
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const menuButton = document.querySelector('.menu-button');

    const registerBox = document.getElementById('registerBox');
    const loginBox = document.querySelector('.login-box');
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');

    // ** آدرس‌های API بک‌اند (4٪ کد پایه Web2) **
    // توجه: آدرس موقت/تستی است. در زمان دیپلوی (Deploy) باید 'http://localhost:10000' با آدرس نهایی Render شما جایگزین شود.
    const API_URL_LOGIN = 'http://localhost:10000/api/login';
    const API_URL_REGISTER = 'http://localhost:10000/api/register';
    
    // --- منطق ۱: پردازش فرم ورود (Login) ---
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); 
        
        const username = document.getElementById('username').value; // در بک‌اند به عنوان email استفاده می‌شود
        const password = document.getElementById('password').value;
        const doneButton = loginForm.querySelector('.done-button'); 
        
        doneButton.disabled = true;

        if (!username || !password) {
            alert("لطفاً تمامی فیلدها را پر کنید.");
            doneButton.disabled = false;
            return;
        }

        try {
            // ارسال داده‌ها به سرور بک‌اند
            const response = await fetch(API_URL_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password: password }) 
            });

            const data = await response.json();

            if (response.ok) {
                // ورود موفقیت‌آمیز
                alert(`ورود موفقیت‌آمیز! خوش آمدید، ${username}.`);
                // ذخیره توکن (کلید امنیتی) و هدایت به داشبورد
                localStorage.setItem('token', data.token); 
                window.location.href = 'dashboard.html'; 
            } else {
                // ورود ناموفق
                alert(`خطا در ورود: ${data.message || 'ایمیل یا رمز عبور اشتباه است.'}`);
            }

        } catch (error) {
            console.error('خطای شبکه یا اتصال به سرور:', error);
            alert("خطا در اتصال به سرور. لطفاً بعداً تلاش کنید.");
        } finally {
            doneButton.disabled = false; 
        }
    });

    // --- منطق ۲: پردازش فرم ثبت‌نام (Register) ---
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const registerButton = registerForm.querySelector('.done-button');

        registerButton.disabled = true;

        if (password !== confirmPassword) {
            alert("تکرار رمز عبور صحیح نیست.");
            registerButton.disabled = false;
            return;
        }

        try {
            const response = await fetch(API_URL_REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`ثبت‌نام موفقیت‌آمیز! خوش آمدید، ${email}. اکنون می‌توانید وارد شوید.`);
                // پس از ثبت‌نام موفق، به فرم ورود باز می‌گردیم
                loginBox.classList.remove('hidden');
                registerBox.classList.add('hidden');
            } else {
                alert(`خطا در ثبت‌نام: ${data.message || 'ایمیل قبلاً ثبت شده است یا خطای سرور رخ داده است.'}`);
            }

        } catch (error) {
            console.error('خطای شبکه یا اتصال به سرور:', error);
            alert("خطا در اتصال به سرور. لطفاً بعداً تلاش کنید.");
        } finally {
            registerButton.disabled = false;
        }
    });

    // --- منطق ۳: سوئیچ بین ورود و ثبت‌نام ---
    if (switchToRegisterLink && registerBox && loginBox) {
        // از ورود به ثبت‌نام
        switchToRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
        });
    }

    if (switchToLoginLink && registerBox && loginBox) {
        // از ثبت‌نام به ورود
        switchToLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });
    }

    // --- منطق ۴: Placeholder برای دکمه منو/داشبورد ---
    menuButton.addEventListener('click', () => {
        alert("داشبورد در ارتقاء بعدی به یک منوی کامل تبدیل خواهد شد.");
    });
});
