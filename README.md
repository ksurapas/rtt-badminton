# RTT Badminton Club Manager

A website for managing your badminton club activities, built with [Astro](https://astro.build/). It helps your group of friends:

- **Split bills** — Divide court fees, shuttlecock costs, and dinner bills fairly among players
- **Track MMR rankings** — An ELO-style rating system that updates after every match
- **Generate matchups** — Automatically create balanced teams based on player skill levels
- **Manage player profiles** — Each player gets a profile page with their photo, stats, and match history

Everything runs in the browser — no server or database needed. Your data is saved in the browser's local storage.

---

## Table of Contents

1. [What You Need](#what-you-need)
2. [Installing Node.js](#installing-nodejs)
3. [Setting Up the Project](#setting-up-the-project)
4. [Running the Site Locally](#running-the-site-locally)
5. [Building for Production](#building-for-production)
6. [Running Tests](#running-tests)
7. [Deploying to GitHub Pages](#deploying-to-github-pages)

---

## What You Need

- A computer (Windows, Mac, or Linux)
- An internet connection (for the initial setup)
- A web browser (Chrome, Firefox, Edge, Safari, etc.)

That's it! This guide will walk you through everything else step by step.

---

## Installing Node.js

Node.js is a program that lets you run JavaScript on your computer. You need it to build and run this project.

### Step 1: Download Node.js

1. Open your web browser and go to **[https://nodejs.org](https://nodejs.org)**
2. You will see two download buttons. Click the one that says **"LTS"** (Long Term Support) — this is the stable, recommended version
3. The website will automatically detect your operating system (Windows, Mac, or Linux) and give you the right download

### Step 2: Install Node.js

- **Windows**: Double-click the downloaded `.msi` file and follow the installer. Click "Next" through each step and accept the defaults.
- **Mac**: Double-click the downloaded `.pkg` file and follow the installer.
- **Linux**: Follow the instructions on the [Node.js downloads page](https://nodejs.org/en/download/) for your distribution.

### Step 3: Verify the installation

After installing, you need to open a **terminal** (also called "command prompt" or "command line"):

- **Windows**: Press the `Windows` key, type `cmd`, and press Enter. This opens the Command Prompt.
- **Mac**: Press `Cmd + Space`, type `Terminal`, and press Enter.
- **Linux**: Press `Ctrl + Alt + T` or find "Terminal" in your applications menu.

In the terminal, type these two commands (press Enter after each one):

```bash
node -v
```

```bash
npm -v
```

Each command should print a version number (for example, `v20.11.0` and `10.2.0`). If you see version numbers, Node.js is installed correctly. If you see an error like "command not found", try restarting your computer and running the commands again.

---

## Setting Up the Project

### Step 1: Get the project files onto your computer

Copy the entire project folder to your computer. You can do this by:
- Downloading it as a ZIP file and extracting it, or
- Copying it from a USB drive, or
- Any other method that gets all the files onto your machine

### Step 2: Open a terminal in the project folder

You need to open a terminal that is "inside" the project folder:

- **Windows**: Open the project folder in File Explorer, click on the address bar at the top, type `cmd`, and press Enter. A Command Prompt window will open in that folder.
- **Mac**: Open the project folder in Finder, then right-click the folder and select "New Terminal at Folder". (If you don't see this option, go to System Settings → Keyboard → Keyboard Shortcuts → Services and enable "New Terminal at Folder".)
- **Linux**: Open the project folder in your file manager, right-click in an empty area, and select "Open Terminal Here".

### Step 3: Install dependencies

In the terminal, type this command and press Enter:

```bash
npm install
```

This downloads all the libraries and tools the project needs. It may take a minute or two. You will see some progress messages — that's normal. When it finishes, you should see a message like "added X packages".

---

## Running the Site Locally

To start the website on your computer, run this command in the terminal:

```bash
npm run dev
```

After a few seconds, you will see a message like:

```
Local    http://localhost:4321/rtt-badminton/
```

**What does `localhost:4321` mean?**
- `localhost` means "this computer" — the website is running right here on your machine, not on the internet
- `4321` is the "port number" — think of it as a door number that the website uses
- `/rtt-badminton/` is the path to the site

**To view the site:** Open your web browser (Chrome, Firefox, etc.) and type `http://localhost:4321/rtt-badminton/` into the address bar, then press Enter. You should see the RTT Badminton Club Manager website!

**To stop the server:** Go back to the terminal and press `Ctrl + C` (hold the Ctrl key and press C). This shuts down the local server.

---

## Building for Production

When you're ready to create a version of the site that can be deployed (published online), run:

```bash
npm run build
```

This creates an optimized version of the site in a folder called `dist/`. You don't need to do anything with this folder manually — the deployment process (described below) handles it for you.

### Previewing the built site

If you want to check what the production build looks like before deploying, run:

```bash
npm run preview
```

This starts a local server that serves the built site, similar to `npm run dev` but using the production files. Open the URL shown in the terminal to preview it. Press `Ctrl + C` to stop.

---

## Running Tests

To run the project's test suite, use:

```bash
npm test
```

This runs all unit tests and property-based tests using Vitest. You will see output showing which tests passed or failed. All tests should pass on a fresh project.

---

## Deploying to GitHub Pages

This section walks you through publishing your site on the internet for free using GitHub Pages. Don't worry if you've never used Git or GitHub before — we'll go through every step.

### Step 1: Create a GitHub account

1. Go to **[https://github.com](https://github.com)** in your web browser
2. Click **"Sign up"** in the top-right corner
3. Follow the steps to create your account (you'll need an email address)
4. Verify your email address when GitHub sends you a confirmation email

If you already have a GitHub account, skip this step and sign in.

### Step 2: Create a new repository

1. After signing in to GitHub, click the **"+"** button in the top-right corner and select **"New repository"**
2. For **"Repository name"**, type: `rtt-badminton`
3. Leave it set to **"Public"**
4. Do **NOT** check "Add a README file" (we already have one)
5. Click **"Create repository"**

You will see a page with setup instructions — keep this page open, you'll need the URL shown there.

### Step 3: Update the site configuration with your GitHub username

Before deploying, you need to tell the project your GitHub username. Open the file `astro.config.mjs` in a text editor and find this line:

```js
site: 'https://your-username.github.io',
```

Replace `your-username` with your actual GitHub username. For example, if your GitHub username is `john123`, change it to:

```js
site: 'https://john123.github.io',
```

Save the file.

### Step 4: Install Git

Git is a tool that tracks changes to your code and lets you upload it to GitHub.

- **Windows**: Download Git from **[https://git-scm.com/download/win](https://git-scm.com/download/win)** and run the installer. Accept all the default settings.
- **Mac**: Open Terminal and type `git --version`. If Git is not installed, your Mac will prompt you to install it. Follow the prompts.
- **Linux**: Open Terminal and run `sudo apt install git` (Ubuntu/Debian) or `sudo dnf install git` (Fedora).

To verify Git is installed, run:

```bash
git --version
```

You should see a version number like `git version 2.43.0`.

### Step 5: Set up Git and push your code

Open a terminal in the project folder (the same way you did earlier) and run these commands one at a time. Press Enter after each one:

```bash
git init
```

This tells Git to start tracking this folder.

```bash
git add .
```

This tells Git to include all the files in the project.

```bash
git commit -m "Initial commit"
```

This saves a snapshot of all your files. (If Git asks you to set your name and email, run these two commands first, replacing the placeholder values with your info, then run the commit command again):

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

```bash
git branch -M main
```

This names your main branch "main" (GitHub expects this).

```bash
git remote add origin https://github.com/YOUR-USERNAME/rtt-badminton.git
```

**Important:** Replace `YOUR-USERNAME` with your actual GitHub username. This connects your local project to the GitHub repository you created in Step 2.

```bash
git push -u origin main
```

This uploads your code to GitHub. You may be asked to sign in to GitHub — follow the prompts.

### Step 6: Enable GitHub Pages

1. Go to your repository on GitHub (e.g., `https://github.com/YOUR-USERNAME/rtt-badminton`)
2. Click the **"Settings"** tab (near the top of the page)
3. In the left sidebar, click **"Pages"**
4. Under **"Source"**, select **"GitHub Actions"** from the dropdown menu
5. That's it! You don't need to select a branch — the included workflow file handles everything automatically

### Step 7: Deploy your site

Your site will deploy automatically every time you push code to the `main` branch. Since you just pushed your code in Step 5, the deployment should already be running!

To check the status:

1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. You should see a workflow run called "Deploy to GitHub Pages" — click on it to see the progress
4. A green checkmark means the deployment succeeded

### Step 8: Visit your live site

Once the deployment finishes (usually takes 1-2 minutes), your site will be live at:

```
https://YOUR-USERNAME.github.io/rtt-badminton/
```

Replace `YOUR-USERNAME` with your GitHub username. Bookmark this URL — it's your club's website!

### Making updates

Whenever you want to update the site, make your changes locally, then run these commands in the terminal:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Actions will automatically rebuild and redeploy your site within a couple of minutes.

---

## Project Structure

```
rtt-badminton/
├── public/              # Static files (favicon, etc.)
├── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layout templates
│   ├── lib/             # Core logic modules
│   │   ├── bill-splitter.ts    # Bill splitting calculations
│   │   ├── matchmaker.ts       # Balanced team generation
│   │   ├── mmr-engine.ts       # ELO-style MMR calculations
│   │   ├── ranking.ts          # Player ranking and sorting
│   │   ├── storage-service.ts  # localStorage persistence
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Shared utility functions
│   ├── pages/           # Website pages
│   └── styles/          # Global stylesheets
├── .github/workflows/   # GitHub Actions deployment config
├── astro.config.mjs     # Astro configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

---

## Troubleshooting

**"command not found" when running `node`, `npm`, or `git`**
- Make sure you installed the program correctly (see the installation steps above)
- Try restarting your terminal or your computer
- On Windows, make sure the program was added to your PATH during installation

**`npm install` shows errors**
- Make sure you have an internet connection
- Try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again

**The site doesn't load in the browser**
- Make sure the dev server is still running in the terminal (you should see the `localhost` URL)
- Check that you're using the correct URL: `http://localhost:4321/rtt-badminton/`
- Try a different browser

**GitHub Pages shows a 404 error**
- Make sure you updated `astro.config.mjs` with your actual GitHub username in the `site` field
- Make sure the repository name is exactly `rtt-badminton`
- Check the Actions tab on GitHub to see if the deployment succeeded
- Wait a few minutes — it can take a little while for the site to go live after the first deployment

**Tests fail**
- Make sure you ran `npm install` first
- Try running `npm test` again — some tests may be flaky on the first run
