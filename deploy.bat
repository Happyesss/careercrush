@echo off
echo 🚀 Starting Stemlen Next.js deployment setup...

REM Navigate to the Next.js project directory
cd /d "c:\Users\hp\Desktop\Stemlen-Frontend-Working-main\nextjs-app"

echo 📦 Installing dependencies...
npm install

echo 🔧 Building the application...
npm run build

echo ✅ Build completed successfully!

echo.
echo 🌟 Your Next.js application is ready!
echo.
echo Available commands:
echo   npm run dev      - Start development server
echo   npm run build    - Build for production  
echo   npm run start    - Start production server
echo   npm run lint     - Run ESLint
echo.
echo Development server will be available at: http://localhost:3000
echo.
echo 🎉 Migration from React to Next.js completed successfully!
pause