import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid query." },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: `You are an originality assessor. The user will give you an idea, question, or thought. Your job is to determine whether it is original — meaning it has NOT been widely discussed, asked, or implemented on the internet before.

Evaluate based on these criteria:
1. Does this content or a very similar version already exist elsewhere on the internet?
2. Has someone asked this question or proposed this idea before?
3. Has the idea been put into practice already?

Respond with EXACTLY this JSON format and nothing else:
{"isOriginal": true or false, "explanation": "A brief 1-2 sentence explanation of why or why not."}

Be honest and rigorous. Most common ideas are NOT original. Only mark something as original if it is genuinely novel and unlikely to have been explored before.`,
      messages: [
        {
          role: "user",
          content: query.trim(),
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const result = JSON.parse(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking originality:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
