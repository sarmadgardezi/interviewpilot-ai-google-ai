import { NextResponse } from "next/server";
import { generatePersonalizedOnboardingAdvice } from "@/lib/ai/openrouter";
import {
  generate10Questions,
  evaluateCandidateAnswer,
  chatWithInterviewAgent,
  searchCompanyInterviewQuestions,
  chatWithInterviewPilot,
} from "@/lib/ai/interviewEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, params } = body;

    if (action === "onboarding_advice") {
      const advice = await generatePersonalizedOnboardingAdvice(params);
      return NextResponse.json({ success: true, advice });
    }

    if (action === "company_search") {
      const companyData = await searchCompanyInterviewQuestions(
        params.companyName,
        params.targetRole
      );
      return NextResponse.json({ success: true, companyData });
    }

    if (action === "chat_conversation") {
      const reply = await chatWithInterviewPilot(params);
      return NextResponse.json({ success: true, reply });
    }

    if (action === "generate_questions") {
      const questions = await generate10Questions(params);
      return NextResponse.json({ success: true, questions });
    }

    if (action === "evaluate_answer") {
      const evaluation = await evaluateCandidateAnswer(params);
      return NextResponse.json({ success: true, evaluation });
    }

    if (action === "chat_with_agent") {
      const reply = await chatWithInterviewAgent(params);
      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json(
      { error: "Unknown action specified" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("AI API Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
