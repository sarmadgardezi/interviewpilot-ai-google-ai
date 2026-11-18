# 🚀 InterviewPilot AI

### Your Personal AI-Powered Interview Coach

InterviewPilot AI is an intelligent interview preparation application powered by **Google Gemini**, **Next.js**, and **Firebase App Hosting**.

It helps students, developers, and job seekers prepare for technical interviews by generating relevant questions, evaluating answers, providing instant feedback, and tracking performance.

Built as a hands-on project for **Road to DevFest 2026 — GDG Cloud Islamabad**.

## ✨ Features

- 🎯 **Interview Categories** — Choose Frontend Development, Backend Development, AI/ML, Cloud Computing, Cybersecurity, and more.
- 🔍 **AI-Powered Questions** — Gemini uses Google Search grounding to research relevant interview topics and generate 10 questions.
- 🧠 **Intelligent Answer Evaluation** — Receive AI-generated marks out of 10 for each answer.
- 💬 **Instant Feedback** — Understand your strengths, mistakes, and areas for improvement.
- 📊 **Performance Tracking** — View interview progress and a final score out of 100.
- ⚡ **Difficulty Levels** — Practice beginner, intermediate, and advanced interviews.
- ☁️ **Cloud Deployment** — Deploy your application using Firebase App Hosting.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend and backend |
| TypeScript | Application development |
| Tailwind CSS | UI styling |
| Google Gemini | AI question generation and answer evaluation |
| Google Search Grounding | Research interview topics |
| Firebase App Hosting | Application deployment |

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js 20 or newer (use the version supported by the project)
- npm
- Git
- Google account
- Access to Gemini through the Gemini Developer API or Vertex AI
- Firebase project for deployment

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/interviewpilot-ai.git
cd interviewpilot-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

For Gemini Developer API:

```env
GEMINI_API_KEY=your_gemini_api_key
```

For Vertex AI, configure the application to use Google Cloud credentials and project settings instead.

Never commit `.env.local`, API keys, or service account credentials to GitHub.

### 4. Run the Application

```bash
npm run dev
```

Open:

`http://localhost:3000`

## 🎮 How to Use

1. Open InterviewPilot AI.
2. Select your interview category.
3. Choose a difficulty level.
4. Generate 10 interview questions.
5. Answer each question.
6. Receive AI-generated marks and feedback.
7. View your final interview performance report.

AI scores are practice estimates, not official hiring assessments.

## ☁️ Deploy to Firebase App Hosting

1. Push your project to GitHub.
2. Create a project in Firebase Console.
3. Upgrade to the Blaze billing plan and connect an eligible Google Cloud billing account.
4. Open **Firebase App Hosting**.
5. Connect your GitHub repository.
6. Configure the required Gemini credentials or runtime permissions securely.
7. Create the App Hosting backend and deploy.
8. Open your deployed application URL.

**Firebase Console:** https://console.firebase.google.com/

**Firebase App Hosting Documentation:** https://firebase.google.com/docs/app-hosting

Firebase App Hosting and Gemini usage may incur charges. Google Cloud promotional credit eligibility depends on the specific credit program.

## 🧠 How InterviewPilot AI Works

```text
User Selects Interview Category
             |
             v
    Next.js Application
             |
             v
        Gemini AI
             |
             v
  Research Interview Topics
             |
             v
   Generate 10 Questions
             |
             v
    Student Submits Answer
             |
             v
    AI Evaluates Response
             |
             v
   Marks + Feedback + Score
             |
             v
      Final Performance
```

## 🎓 Workshop

**Event:** Road to DevFest 2026  
**Community:** GDG Cloud Islamabad  
**Venue:** COMSATS University Abbottabad  
**Workshop:** Building and Deploying Autonomous Agents: From Concept to Google Cloud

Participants will learn how to integrate Gemini with Next.js, build AI-driven interview workflows, evaluate responses, and deploy an application using Firebase App Hosting.

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## 📄 License

A license will be added by the repository owner.

---

### 👨‍💻 Developed By

**Sarmad Gardezi**

*Built with ❤️ using Next.js, Google Gemini, and Firebase.*

**Road to DevFest 2026 | GDG Cloud Islamabad**
