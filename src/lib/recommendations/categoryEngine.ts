import {
  OnboardingSurveyData,
  UserRecommendations,
  DifficultyLevel,
} from "@/types/interview";

export function deriveRecommendations(
  survey: OnboardingSurveyData
): UserRecommendations {
  // 1. Derive Difficulty Level
  let recommendedDifficulty: DifficultyLevel = "Intermediate";
  if (survey.experienceLevel === "student") {
    recommendedDifficulty = "Beginner";
  } else if (survey.experienceLevel === "junior") {
    recommendedDifficulty =
      survey.interviewFocus === "system_design" ? "Intermediate" : "Beginner";
  } else if (survey.experienceLevel === "mid") {
    recommendedDifficulty = "Intermediate";
  } else if (survey.experienceLevel === "senior") {
    recommendedDifficulty = "Advanced";
  }

  // 2. Derive Category Title & Description based on Role & Focus
  let categoryTitle = "Full Stack Web Engineering";
  let categoryDescription =
    "End-to-end technical concepts covering modern web frameworks, APIs, and cloud deployment.";
  let targetRoleLabel = "Full Stack Developer";
  let recommendedTopics = [
    "Next.js App Router & Server Components",
    "RESTful API & Database Architecture",
    "State Management & Performance",
    "Authentication & Security Basics",
    "CI/CD & Cloud Deployment (Cloud Run / Firebase)",
  ];

  switch (survey.targetRole) {
    case "frontend":
      categoryTitle = "Frontend Engineering & UI Systems";
      categoryDescription =
        "Core JavaScript/TypeScript, modern React patterns, web performance, rendering pipelines, and responsive CSS.";
      targetRoleLabel = "Frontend Engineer";
      recommendedTopics = [
        "React Component Lifecycle & Hooks",
        "TypeScript Strict Typing & Generics",
        "Next.js Rendering (SSR, SSG, Hydration)",
        "CSS Layouts, Tailwind, & Web Performance",
        "Frontend Testing & State Architecture",
      ];
      break;

    case "backend":
      categoryTitle = "Backend Architecture & Distributed Services";
      categoryDescription =
        "Server-side logic, database query optimization, REST/gRPC API contracts, microservices, and concurrency.";
      targetRoleLabel = "Backend Engineer";
      recommendedTopics = [
        "API Design & Error Handling (REST / gRPC)",
        "SQL Query Optimization & Database Indexing",
        "Caching Strategies with Redis",
        "Concurrency, Threads, & Event-Driven Architecture",
        "Authentication, JWT, & OAuth2 Security",
      ];
      break;

    case "mobile":
      categoryTitle = "Mobile Application Development";
      categoryDescription =
        "Cross-platform and native mobile patterns, state lifecycle, offline synchronization, and app store deployment.";
      targetRoleLabel = "Mobile Developer";
      recommendedTopics = [
        "Flutter Widget Lifecycle & State Management",
        "Asynchronous Dart & Network Handling",
        "Local Storage & SQLite/Hive Caching",
        "Mobile App Performance & Frame Rates",
        "Platform Channels & Native Integration",
      ];
      break;

    case "ai_data":
      categoryTitle = "Applied AI & Machine Learning Engineering";
      categoryDescription =
        "LLM integrations, prompt engineering, vector databases, pipeline orchestration, and model evaluation.";
      targetRoleLabel = "AI / Data Engineer";
      recommendedTopics = [
        "LLM APIs & Google Gen AI SDK (Gemini / Gemma)",
        "Vector Embeddings & RAG Architectures",
        "Python Data Pipelines & Preprocessing",
        "Prompt Design & Structured Outputs",
        "Model Fine-Tuning & Evaluation Metrics",
      ];
      break;

    case "devops_cloud":
      categoryTitle = "Cloud Infrastructure & Site Reliability";
      categoryDescription =
        "Containerization, cloud platform services, infrastructure as code, automated pipelines, and monitoring.";
      targetRoleLabel = "DevOps & Cloud Engineer";
      recommendedTopics = [
        "Docker Containerization & Multi-stage Builds",
        "Kubernetes Pod Scheduling & Services",
        "Google Cloud Platform (Cloud Run, IAM, VPC)",
        "CI/CD Pipeline Automation (GitHub Actions)",
        "Monitoring, Observability, & Incident Response",
      ];
      break;

    default:
      break;
  }

  // Adjust for Behavioral Focus
  if (survey.interviewFocus === "behavioral") {
    categoryTitle = `${targetRoleLabel}: Leadership & Behavioral`;
    categoryDescription =
      "Scenario-based leadership questions, conflict resolution, project delivery, and STAR framework responses.";
    recommendedTopics = [
      "STAR Method (Situation, Task, Action, Result)",
      "Handling Difficult Stakeholders & Team Conflict",
      "Prioritizing Technical Debt vs. Business Deadlines",
      "Mentorship & Cross-functional Collaboration",
      "Learning from Failure & Major Outage Post-mortems",
    ];
  }

  return {
    categoryTitle,
    categoryDescription,
    recommendedDifficulty,
    recommendedTopics,
    targetRoleLabel,
  };
}
