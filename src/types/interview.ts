export type TargetRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "ai_data"
  | "devops_cloud";

export type ExperienceLevel = "student" | "junior" | "mid" | "senior";

export type InterviewFocus =
  | "technical"
  | "system_design"
  | "behavioral"
  | "comprehensive";

export type PreparationTimeline =
  | "immediate"
  | "one_month"
  | "long_term"
  | "exploring";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface OnboardingSurveyData {
  targetRole: TargetRole;
  experienceLevel: ExperienceLevel;
  primarySkills: string[];
  interviewFocus: InterviewFocus;
  preparationTimeline: PreparationTimeline;
  completedAt?: string;
}

export interface UserRecommendations {
  categoryTitle: string;
  categoryDescription: string;
  recommendedDifficulty: DifficultyLevel;
  recommendedTopics: string[];
  targetRoleLabel: string;
  aiAdvice?: string;
}

export interface UserInterviewStats {
  interviewsCompleted: number;
  averageScore: number;
  bestScore: number;
  recentScore: number;
  performanceTrend: { date: string; score: number }[];
  weakAreas: string[];
  strongAreas: string[];
}

export type JobLocation =
  | "global_remote"
  | "pakistan"
  | "united_states"
  | "united_kingdom_europe"
  | "india"
  | "middle_east";

export interface InterviewQuestion {
  id: number;
  question: string;
  topic: string;
  difficulty: DifficultyLevel;
  marksAvailable: number; // 10
  rubricHint: string;
  accurateAnswer: string; // The accurate/ideal model answer
  globalCompanies?: string[]; // e.g. ["Google", "Meta", "Stripe", "Amazon"]
  pakistanCompanies?: string[]; // e.g. ["Arbisoft", "Systems Limited", "Careem", "10Pearls"]
  frequency?: "Very High" | "High" | "Core Modern Standard";
  conceptualEra?: string; // e.g. "Modern Era (2025/2026)"
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  type?: "question" | "answer" | "evaluation" | "model_answer" | "discussion";
}

export interface CompanyQuestion {
  id: number;
  question: string;
  topic: string;
  whyAsked: string;
  accurateAnswer: string;
}

export interface CompanyInterviewData {
  company: string;
  summary: string;
  engineeringCulture: string;
  questions: CompanyQuestion[];
}

export interface AnswerEvaluation {
  questionId: number;
  marksEarned: number; // 0 to 10
  explanation: string;
  correctConcepts: string[];
  missingConcepts: string[];
  suggestions: string;
  accurateAnswer: string;
}

export interface InterviewSessionData {
  id: string;
  createdAt: string;
  targetRole: string;
  difficulty: string;
  location: JobLocation;
  locationLabel: string;
  questions: InterviewQuestion[];
  evaluations: Record<number, AnswerEvaluation>;
  userAnswers: Record<number, string>;
  totalMarks: number;
  maxMarks: number;
  isCompleted: boolean;
}
