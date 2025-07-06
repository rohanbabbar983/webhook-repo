# 📡 GitHub Webhook Receiver – Dev Assessment

This repository contains:

- A **Flask-based Webhook Receiver** that listens for GitHub Push, Pull Request, and Merge events
- A **React Frontend** that displays the activity feed in real-time
- MongoDB used to store webhook events
- Optional Ngrok setup for local webhook testing

---

## 🚀 Features

- Receives GitHub webhooks and stores them in MongoDB
- React UI polls the backend every 15 seconds to show latest activity
- Supports Push, Pull Request, and Merge actions
- Icons, branch formatting, author highlights, and loading UI

---

## 🐍 Backend Setup (Flask API)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/webhook-repo.git
cd webhook-repo
```
### 2. Create and activate virtual environment

```bash
pip install virtualenv
virtualenv venv
# Activate:
# On Linux/macOS:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```
### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup .env file

```bash
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/githubEvents?retryWrites=true&w=majority
```

### 5. Run Flask Server

```bash
python run.py
```
By default it runs at: http://localhost:5000

## Webhook Setup using Ngrok (for local testing)

### 1. Install and run Ngrok:

```bash
ngrok http 5000
```

### 2. Copy the forwarding URL:

```arduino
https://abc123.ngrok.io (for example)
```

### 3. Set Webhook in GitHub

Go to your action-repo → Settings → Webhooks → Add webhook:

Payload URL: https://abc123.ngrok.io/webhook/receiver (for example)

Content type: application/json

Events: Just the individual events (Push, Pull Request)

Secret: (leave blank unless you validate signatures)

