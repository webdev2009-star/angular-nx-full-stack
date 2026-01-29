# Git Setup Instructions for webdev2009-star Account

## Problem
You have multiple git identities configured, and need to push to `webdev2009-star` instead of `endlessfiler`.

## Solution: Repository-Specific Git Configuration

### Option 1: Use the Automated Scripts (Recommended)

I've created two batch files to help you:

#### Step 1: Run the setup script
```bash
setup-git-webdev.bat
```

This will:
- Configure git user for this repository ONLY (won't affect other repos)
- Set username to `webdev2009-star`
- Initialize git if needed
- Set the correct remote URL
- Show you the configuration

#### Step 2: Run the push script
```bash
push-to-github.bat
```

This will:
- Stage all your files
- Create the initial commit
- Push everything to GitHub

### Option 2: Manual Commands

If you prefer to run commands manually:

```bash
# 1. Configure git identity for THIS REPOSITORY ONLY
git config user.name "webdev2009-star"
git config user.email "webdev2009-star@users.noreply.github.com"

# 2. Initialize git (if not already done)
git init

# 3. Remove any existing remote and add the correct one
git remote remove origin
git remote add origin https://github.com/webdev2009-star/angular-nx-full-stack.git

# 4. Verify configuration
git config user.name
git config user.email
git remote -v

# 5. Stage all files
git add .

# 6. Commit with a message
git commit -m "Initial commit: Complete Secure Task Management System"

# 7. Set main branch and push
git branch -M main
git push -u origin main
```

## Why This Works

Using `git config` (without `--global`) sets the configuration ONLY for this repository. Your other repositories with `endlessfiler` won't be affected.

## GitHub Authentication

When you push, GitHub will ask for authentication. You have two options:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use the token as your password when prompted

### Option B: GitHub CLI
```bash
gh auth login
```

## Verify After Push

Once pushed, check your repository at:
https://github.com/webdev2009-star/angular-nx-full-stack

## Troubleshooting

### If you get "repository not found":
- Make sure you're logged in as `webdev2009-star` on GitHub
- Verify the repository exists at: https://github.com/webdev2009-star/angular-nx-full-stack
- Check you have write access to the repository

### If you get credential errors:
- Use a Personal Access Token instead of password
- Or use `gh auth login` with GitHub CLI

### If you want to check which identity will be used:
```bash
git config user.name
git config user.email
```

This shows the LOCAL (repository-specific) config, which overrides global settings.

## After Successful Push

Your complete Task Management System will be on GitHub and ready for:
1. TurboVets assessment submission
2. Further development
3. Sharing with the team

---

**Note**: The batch files are ready to use. Just double-click them or run them from the terminal!
