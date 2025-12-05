[![Leer en Español](https://img.shields.io/badge/Leer%20en-Espa%C3%B1ol-ES?style=for-the-badge&logo=es)](GIT_GUIDE.md)

# Guide to upload your project to GitHub

Follow these steps to save your code in the cloud (GitHub).

## Step 1: Preparation (Already done)
I have created a `.gitignore` file to prevent heavy files (like `node_modules`) or private data (like the database and photos) from being uploaded.

## Step 2: Initialize local repository

Open a terminal in the `club-socios` folder and run:

```powershell
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Save the first version
git commit -m "Initial version of Club Socios"
```

## Step 3: Create the repository on GitHub

1.  Go to [github.com](https://github.com) and log in.
2.  Click the **+** button (top right) and select **"New repository"**.
3.  Give it a name (e.g., `club-socios`).
4.  Choose if you want it to be **Public** or **Private**.
5.  **DO NOT** check any "Initialize this repository with..." box.
6.  Click on **"Create repository"**.

## Step 4: Connect and upload

GitHub will show you some commands. Copy and paste those that look like these (replace `YOUR_USER` with your real user):

```powershell
# Change the main branch name to 'main'
git branch -M main

# Connect with GitHub (replace the URL with yours)
git remote add origin https://github.com/YOUR_USER/club-socios.git

# Upload files
git push -u origin main
```

Done! Your code is now safe on GitHub.

## Important Notes

*   **Database and Photos**: For security, the database (`club.db`) and member photos **are NOT uploaded** to GitHub. If you change PCs, you will have to copy them manually (as explained in `DEPLOY.md`).
*   **Files .env**: Private configurations are also not uploaded.
