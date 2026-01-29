@echo off
echo ========================================
echo Git Setup for webdev2009-star Account
echo ========================================
echo.

REM Configure git user for this repository only (local config)
echo Configuring git identity for webdev2009-star...
git config user.name "webdev2009-star"
git config user.email "webdev2009-star@users.noreply.github.com"

REM Check if .git exists, if not initialize
if not exist .git (
    echo Initializing git repository...
    git init
) else (
    echo Git repository already initialized.
)

REM Remove existing origin if it exists
echo Setting up remote origin...
git remote remove origin 2>nul

REM Add the correct remote
git remote add origin https://github.com/webdev2009-star/angular-nx-full-stack.git

REM Verify configuration
echo.
echo ========================================
echo Current Git Configuration:
echo ========================================
git config user.name
git config user.email
echo.
echo Remote URL:
git remote -v
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review your changes: git status
echo 2. Stage all files: git add .
echo 3. Commit: git commit -m "Initial commit: Task Management System"
echo 4. Set branch to main: git branch -M main
echo 5. Push to GitHub: git push -u origin main
echo.
pause
