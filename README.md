# Mind Haven - Mental Health Journaling Platform


## Project Description
Mind Haven is a comprehensive mental health platform designed to provide support and resources to individuals seeking emotional well-being. It features journaling capabilities with AI-powered progress tracking, educational content, and a supportive community environment.

## Features

- ✍️ Secure journaling space
- 🧠 AI-powered mental health analysis
- 📈 Progress tracking over time
- 📊 Mental health statistics
- 🌟 Wall of positivity
- 🔒 User authentication



## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key (for AI analysis feature)

### Installation

1. Clone the repository
```bash
git clone https://github.com/itsriteshs/mind-haven.git
cd mind-haven
```
2. Install dependencies
```bash
npm install
cd server
npm install
```
3.Set up environment variables
```bash
cd server
touch .env
```
Add to .env:
```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
```
4.Start the server
```bash
node server.js
```
## Usage Guide

### 1.Create an account
Click on "Login" then "Register here"
Enter your details to create an account

### 2.Journaling
Navigate to "Inner Verse"
Write your thoughts and feelings
Save entries with the "Save Entry" button

### 3.Track progress
After multiple entries, click "Get Progress"
View personalized AI analysis of your journey

### 4.Explore resources
Check mental health statistics
Visit the Wall of Positivity for inspiration

## Troubleshooting

| Issue                  | Solution                          |
|------------------------|-----------------------------------|
| Server not starting    | Check port 3000 availability      |
| AI analysis failing    | Verify OpenAI API key             |
| Entries not saving     | Check browser console for errors  |
| Login issues           | Clear browser cache and try again |


