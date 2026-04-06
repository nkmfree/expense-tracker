#!/bin/bash
# Secure GitHub Pages Deployment Script for Expense Tracker
# This script prompts for your GitHub token securely and deploys to GitHub Pages

set -e  # Exit on any error

echo "🚀 Expense Tracker GitHub Pages Deployment"
echo "========================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the expense-tracker directory."
    exit 1
fi

# Get GitHub username
read -p "🔤 Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

# Get repository name
read -p "📁 Enter repository name (or press Enter for 'expense-tracker'): " REPO_NAME
REPO_NAME=${REPO_NAME:-expense-tracker}

# Get GitHub token securely (won't echo to screen)
echo -n "🔐 Enter your GitHub Personal Access Token: "
read -s GITHUB_TOKEN
echo

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GitHub token is required."
    exit 1
fi

# Configure git
echo "⚙️  Configuring git..."
git config user.name "$GITHUB_USERNAME"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Expense Tracker webapp"
fi

# Check if we have a remote already
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
else
    # Update existing remote with token
    echo "🔗 Updating GitHub remote with credentials..."
    git remote set-url origin "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

# Push to main branch
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

# Enable GitHub Pages
echo "📄 Setting up GitHub Pages..."
# Create or update the gh-pages branch
git checkout --orphan gh-pages
git reset --hard
git add .
git commit -m "Deploy to GitHub Pages: $(date)"
git push -f origin gh-pages

# Switch back to main branch
git checkout main

# Clean up any token traces from environment
unset GITHUB_TOKEN

echo
echo "✅ Deployment successful!"
echo "🌐 Your expense tracker is now live at:"
echo "   https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo
echo "📝 Notes:"
echo "   - Updates: Simply modify files and run ./deploy.sh again"
echo "   - Security: Your token was never stored or logged"
echo "   - Troubleshooting: Check GitHub repository settings → Pages section"
echo
echo "🎉 Happy tracking!"