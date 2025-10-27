# Wavepark Shift Manager

سیستم مدیریت شیفت برای مجموعه موج های آبی شامل پنل وب مدرن به همراه API بک اند.

## امکانات کلیدی
- ورود و احراز هویت با نقش های «مدیرکل»، «مدیر»، «مشاهده»
- مدیریت پرسنل، وظایف، شیفت ها و تخصیص نیروها
- گزارش خروجی CSV از تخصیص شیفت ها
- رابط کاربری واکنش گرا با Chakra UI و تم برندینگ آبی

## راه اندازی سریع

### پیش نیازها
- Python 3.11+
- Node.js 18+

### بک اند (FastAPI)
```bash
cd server
python -m venv .venv
source .venv/bin/activate  # در ویندوز: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn server.app.main:app --reload
```
سرویس روی `http://localhost:8000` در دسترس خواهد بود و کاربر مدیر پیش فرض با ایمیل `admin@wavepark.local` و رمز `ChangeMe123!` ایجاد می‌شود.

### فرانت اند (Vite + React)
```bash
cd client
npm install
npm run dev
```
اپلیکیشن UI روی `http://localhost:5173` اجرا شده و با API در پورت 8000 ارتباط می‌گیرد. برای تغییر آدرس API می‌توانید متغیر محیطی `VITE_API_URL` را در فایل `.env` تنظیم کنید.

## تست ها
برای اجرای تست های بک اند:
```bash
cd server
pytest
```

## ساختار پوشه ها
```
server/   # کد FastAPI و تست ها
client/   # کد React و رابط کاربری
```
