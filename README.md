# Expense Tracker (GitHub Backed)

A persistent expense tracker webapp that uses your GitHub repository as a backend for true cross-device data synchronization.

## 🌟 **Key Features**

- **True Persistence**: Expenses stored in your GitHub repository, accessible from any computer/device
- **Real-time Sync**: Automatic polling to detect changes from other devices
- **Status Indicator**: Visual connection status to GitHub backend
- **Full CRUD Operations**: Create, read, update, delete expenses
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Error Handling**: Graceful handling of network issues and server errors
- **Auto-refresh**: Periodic updates to detect changes from other users/devices
- **Privacy Focused**: You control where your data lives (your GitHub repo)

## 🔧 **How It Works**

Instead of using browser localStorage (which is device-specific), this version:

1. **Communicates with a GitHub-backed API** running on `localhost:3000` (or your deployed server)
2. **The API uses the GitHub CLI** (`gh`) via the OpenClaw GitHub skill to store data in your GitHub repository
3. **Data is stored as** `expenses-data.json` in your `nkmfree/expense-tracker` repository
4. **Changes are synchronized** across devices via periodic polling (every 30 seconds)

## 🚀 **Setup Instructions**

### Prerequisites:
1. **GitHub CLI installed and authenticated** (you've already done this!):
   ```bash
   gh auth login
   # ✅ You're already authenticated as nkmfree with repo scope
   ```

2. **Node.js installed** (version 14+ recommended)

### Installation & Usage:
1. **Start the GitHub-backed server**:
   ```bash
   cd /home/claw/.openclaw/workspace/expense-tracker
   npm start
   # Or for development with auto-restart:
   # npm run dev
   ```

2. **Access your expense tracker**:
   - **Locally**: http://localhost:3000
   - **On your local network**: http://[your-local-ip]:3000
   - **From anywhere**: Deploy the server to a cloud service (see deployment options below)

### How Data Flows:
```
Your Browser 
    ↓ (HTTP requests to localhost:3000)
GitHub-backed Server (Node.js/Express)
    ↓ (GitHub API calls via gh CLI - using your enabled GitHub skill!)
Your GitHub Repository (nkmfree/expense-tracker)
    ↓ (Stored as: expenses-data.json)
```

## 📦 **What's Included:**

### Core Files:
- `index.html` - The main webapp (communicates with GitHub backend)
- `github-server.js` - Express server that talks to GitHub API
- `github-backend.js` - Core logic for GitHub API interactions
- `package.json` - Dependencies and scripts
- `GITHUB_BACKEND_README.md` - Detailed technical documentation

### Dependencies:
- `express` - Web framework
- `cors` - Cross-origin resource sharing middleware

## 🔐 **Security & Privacy:**

- **You control the data**: Stored in YOUR GitHub repository (`nkmfree/expense-tracker`)
- **GitHub CLI authentication**: Uses your existing `gh auth login` credentials
- **Token security**: Your GitHub token is managed securely by the GitHub CLI
- **Scope requirements**: Only needs `repo` scope (you already have this)
- **No third-party services**: No data sent to external analytics or tracking services
- **Audit trail**: Full version history via Git commits

## 🌐 **Deployment Options:**

Once you have this working locally, you can deploy it for 24/7 access from anywhere:

### **Free Tier Options:**
1. **Railway.app** - [railway.app](https://railway.app)
2. **Render.com** - [render.com](https://render.com)  
3. **Fly.io** - [fly.io](https://fly.io)
4. **Google Cloud Run** - [cloud.google.com/run](https://cloud.google.com/run)
5. **AWS Lambda + API Gateway** - [aws.amazon.com/lambda/](https://aws.amazon.com/lambda/)

### **Low Cost Options ($5/month):**
1. **DigitalOcean Droplet** - [m.do.co/c/1b5c5b5a5e5e](https://m.do.co/c/1b5c5b5a5e5e)
2. **Linode** - [linode.com](https://linode.com)
3. **Vultr** - [vultr.com](https://vultr.com)
4. **AWS Lightsail** - [aws.amazon.com/lightsail/](https://aws.amazon.com/lightsail/)

### **Self-Hosted Options:**
- Raspberry Pi or old laptop running 24/7
- Home server or NAS device
- Port forwarding on your home router (with proper security)

## 📝 **API Endpoints (for your reference):**
- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Add a new expense
- `DELETE /api/expenses/:id` - Delete an expense by ID
- `GET /health` - Check server and GitHub connection status

## 🔄 **Data Flow Example:**

1. **You add an expense** in your webapp
2. **Browser sends POST request** to `http://localhost:3000/api/expenses`
3. **Express server receives request**
4. **GitHub backend uses `gh` CLI** to:
   - Read current `expenses-data.json` from your repo
   - Append new expense
   - Write updated JSON back to file
   - Commit and push changes to GitHub
5. **Other devices** detect the change via periodic polling (every 30 seconds)
6. **All devices stay synchronized** via your GitHub repository

## 📊 **Data Format in GitHub:**

Your `expenses-data.json` file will contain an array like:
```json
[
  {
    "id": 1680912345678,
    "description": "Groceries",
    "amount": 56.75,
    "date": "2026-04-06",
    "timestamp": "2026-04-06T10:45:32.123Z"
  },
  {
    "id": 1680912456789,
    "description": "Coffee",
    "amount": 4.50,
    "date": "2026-04-06",
    "timestamp": "2026-04-06T11:22:18.456Z"
  }
]
```

You can view this file directly in your GitHub repository at any time!

## 🛠️ **Troubleshooting:**

### Common Issues & Solutions:

**"Connection refused" or "Cannot connect to localhost:3000":**
- Make sure you've started the server with `npm start`
- Check that the server is running (look for the startup message in terminal)
- Verify no other process is using port 3000

**"Failed to save expense" or API errors:**
- Ensure you've run `gh auth login` and are authenticated
- Verify you have `repo` scope in your GitHub token (`gh auth status`)
- Check that the repository `nkmfree/expense-tracker` exists and you have access
- Look at the server console for detailed error messages

**"CORS policy" errors:**
- This usually means you're trying to access the API from a different domain than where it's served
- For local development, make sure you're accessing via `http://localhost:3000`
- For deployment, adjust the CORS settings in `github-server.js` if needed

### **Viewing Logs:**
- Check the terminal where you ran `npm start` for server logs
- Look for error messages, startup info, and request logging
- The server logs GitHub API interactions and any errors that occur

## 🔄 **Alternative Approaches (For Reference):**

While this GitHub-backed approach leverages your enabled GitHub skill, other options include:

1. **Google Sheets Backend** (using GOG skill): Good for non-programmers, familiar interface
2. **Firebase/Supabase**: Real-time databases with built-in auth
3. **Local File Server**: As shown in earlier examples (simplest but less accessible)
4. **Hybrid Approach**: LocalStorage + periodic GitHub backups

## 🎯 **Benefits of This GitHub-Backed Approach:**

- ✅ **True cross-device persistence**: Access from any computer, phone, or tablet
- ✅ **Leverages your enabled skill**: Makes direct use of the GitHub skill you activated
- ✅ **Version control**: Every change tracked via Git (you can undo mistakes!)
- ✅ **Automatic backups**: Your data is safely stored in GitHub
- ✅ **Free**: Uses your existing GitHub account (no additional cost)
- ✅ **Transparent**: Raw data visible in your GitHub repo at any time
- ✅ **Educational**: Teaches REST APIs, GitHub CLI, and full-stack concepts
- ✅ **Privacy-first**: You control exactly where your data lives
- ✅ **Professional**: Uses industry-standard practices for web app development

## 🚀 **Next Steps:**

1. **Start the server**: `npm start`
2. **Verify it works locally**: Visit http://localhost:3000
3. **Test from another device**: On your phone/tablet, visit `http://[your-computer-ip]:3000`
4. **Consider deployment**: Choose a hosting option for 24/7 access
5. **Enjoy your truly persistent expense tracker!**

---
*Built with the OpenClaw GitHub skill - transforming GitHub from a code repository into a powerful backend for your expense tracker!*