@echo off
echo ========================================
echo Pushing to webdev2009-star/angular-nx-full-stack
echo ========================================
echo.

REM Ensure correct identity is set
git config user.name "webdev2009-star"
git config user.email "webdev2009-star@users.noreply.github.com"

REM Show current status
echo Current status:
git status
echo.

REM Stage all files
echo Staging all files...
git add .
echo.

REM Create commit
echo Creating commit...
git commit -m "Initial commit: Complete Secure Task Management System

- NestJS backend with JWT authentication and RBAC
- Angular frontend with TailwindCSS and drag-and-drop
- NX monorepo with shared libraries
- Comprehensive tests and documentation
- Ready for TurboVets assessment submission"
echo.

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo Note: You may need to authenticate with GitHub credentials
git push -u origin main
echo.

echo ========================================
echo Push Complete!
echo ========================================
echo.
echo Your repository is now at:
echo https://github.com/webdev2009-star/angular-nx-full-stack
echo.
pause
