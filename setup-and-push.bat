@echo off
echo ========================================
echo Git Setup for webdev2009-star
echo ========================================
echo.

REM Clear cached credentials to avoid using endlessflier
echo Clearing cached GitHub credentials...
cmdkey /delete:git:https://github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul
echo Credentials cleared!
echo.

REM Set git user for this repo only (won't affect other repos)
git config user.name "webdev2009-star"
git config user.email "webdeveloper2183@gmail.com"

REM Initialize and setup remote
git init
git remote remove origin 2>nul
git remote add origin https://github.com/webdev2009-star/angular-nx-full-stack.git

REM Show config
echo Current configuration:
git config user.name
git config user.email
git remote -v
echo.

REM Stage, commit, and push
echo Staging files...
git add .
echo.

echo Creating commit...
git commit -m "Initial commit: Secure Task Management System with NestJS, Angular, and NX monorepo"
echo.

echo ========================================
echo IMPORTANT: Authentication Required
echo ========================================
echo.
echo Git will ask for credentials in the next step.
echo.
echo Use Personal Access Token (RECOMMENDED):
echo 1. Go to: https://github.com/settings/tokens
echo 2. Generate new token (classic) with "repo" scope
echo 3. When Git asks:
echo    Username: webdev2009-star
echo    Password: [paste your token]
echo.
echo ========================================
echo.
pause

echo Pushing to GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo Done! Repository pushed to GitHub
echo https://github.com/webdev2009-star/angular-nx-full-stack
echo ========================================
pause
