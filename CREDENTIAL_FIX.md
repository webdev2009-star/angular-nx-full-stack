# Fix: Permission Denied Error

## Problem
```
remote: Permission to webdev2009-star/angular-nx-full-stack.git denied to endlessflier.
fatal: unable to access 'https://github.com/webdev2009-star/angular-nx-full-stack.git/': The requested URL returned error: 403
```

Git is using cached credentials for `endlessflier` instead of `webdev2009-star`.

## Solution

### Quick Fix - Run This Script
```bash
setup-and-push.bat
```

This will:
1. ✅ Clear cached GitHub credentials
2. ✅ Configure git for webdev2009-star (this repo only)
3. ✅ Stage and commit all files
4. ✅ Prompt you for authentication
5. ✅ Push to GitHub

### When Git Asks for Credentials

**Option A: Personal Access Token (Recommended)**

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Tokens (classic)"
3. Name it: "TurboVets Upload"
4. Check scope: ☑️ **repo** (Full control of private repositories)
5. Click "Generate token"
6. Copy the token (starts with `ghp_...`)

When Git prompts:
```
Username: webdev2009-star
Password: [paste your token here]
```

**Option B: GitHub CLI**
```bash
gh auth login
```
Then select the webdev2009-star account

### Manual Fix (If Script Doesn't Work)

1. **Clear credentials manually:**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Find "git:https://github.com" entries
   - Delete them

2. **Configure git:**
   ```bash
   git config user.name "webdev2009-star"
   git config user.email "webdeveloper2183@gmail.com"
   ```

3. **Try pushing again:**
   ```bash
   git push -u origin main
   ```

### After Successful Push

Your repository will be at:
https://github.com/webdev2009-star/angular-nx-full-stack

## Why This Happened

Windows Credential Manager caches GitHub credentials. Even though you set the git config to use `webdev2009-star`, the cached `endlessflier` credentials were being used for authentication.

The fix clears the cache so Git will ask for fresh credentials using the correct account.
