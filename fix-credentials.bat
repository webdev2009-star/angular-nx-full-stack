@echo off
echo ========================================
echo Fix Git Credentials for webdev2009-star
echo ========================================
echo.

echo Step 1: Clearing cached GitHub credentials...
echo.

REM Remove cached GitHub credentials
cmdkey /delete:git:https://github.com 2>nul
cmdkey /delete:LegacyGeneric:target=git:https://github.com 2>nul

echo Credentials cleared!
echo.
echo ========================================
echo IMPORTANT: Next Steps
echo ========================================
echo.
echo When you push, Git will ask for credentials.
echo.
echo Option A: Use Personal Access Token (RECOMMENDED)
echo --------------------------------------------------
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token" (classic)
echo 3. Give it a name: "TurboVets Upload"
echo 4. Select scope: "repo" (full control of private repositories)
echo 5. Click "Generate token"
echo 6. Copy the token (starts with ghp_...)
echo.
echo When Git asks:
echo   Username: webdev2009-star
echo   Password: [paste your token here]
echo.
echo Option B: Use GitHub CLI (ALTERNATIVE)
echo ----------------------------------------
echo Run: gh auth login
echo Then select "webdev2009-star" account
echo.
echo ========================================
echo.
pause
