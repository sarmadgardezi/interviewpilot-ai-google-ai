import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { OnboardingSurveyData, UserRecommendations } from "@/types/interview";
import { deriveRecommendations } from "@/lib/recommendations/categoryEngine";

const LOCAL_STORAGE_KEY = "interviewpilot_onboarding_survey";
const RECOMMENDATIONS_STORAGE_KEY = "interviewpilot_user_recommendations";

export interface StoredUserProfile {
  survey?: OnboardingSurveyData;
  recommendations?: UserRecommendations;
  updatedAt?: string;
}

/**
 * Save onboarding survey to localStorage and Cloud Firestore
 */
export async function saveOnboardingData(
  survey: OnboardingSurveyData,
  userId?: string | null
): Promise<{ recommendations: UserRecommendations }> {
  const recommendations = deriveRecommendations(survey);

  // 1. Save to LocalStorage for instant prototype access
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(survey));
      localStorage.setItem(
        RECOMMENDATIONS_STORAGE_KEY,
        JSON.stringify(recommendations)
      );
    } catch (e) {
      console.warn("Could not save survey to localStorage:", e);
    }
  }

  // 2. Persist to Cloud Firestore if user is authenticated
  if (userId) {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(
        userRef,
        {
          onboardingCompleted: true,
          survey,
          recommendations,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Could not persist onboarding to Firestore:", err);
    }
  }

  return { recommendations };
}

/**
 * Load onboarding survey from Firestore or LocalStorage
 */
export async function getOnboardingData(
  userId?: string | null
): Promise<{
  survey: OnboardingSurveyData | null;
  recommendations: UserRecommendations | null;
}> {
  // 1. If user ID provided, try Firestore first
  if (userId) {
    try {
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.survey) {
          return {
            survey: data.survey as OnboardingSurveyData,
            recommendations: (data.recommendations ||
              deriveRecommendations(data.survey)) as UserRecommendations,
          };
        }
      }
    } catch (err) {
      console.warn("Could not fetch survey from Firestore:", err);
    }
  }

  // 2. Fallback to LocalStorage
  if (typeof window !== "undefined") {
    try {
      const savedSurvey = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedRecs = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
      if (savedSurvey) {
        const parsedSurvey = JSON.parse(savedSurvey) as OnboardingSurveyData;
        const parsedRecs = savedRecs
          ? (JSON.parse(savedRecs) as UserRecommendations)
          : deriveRecommendations(parsedSurvey);
        return { survey: parsedSurvey, recommendations: parsedRecs };
      }
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
  }

  return { survey: null, recommendations: null };
}

/**
 * Clear onboarding data (for logout or resetting)
 */
export function clearOnboardingData(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(RECOMMENDATIONS_STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear localStorage:", e);
    }
  }
}
