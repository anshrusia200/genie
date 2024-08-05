/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

interface Payload {
  prompt: string;
  aspect_ratio: string;
  quality: string;
  guidance_scale: number;
  negative_prompt?: string;
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, aspect_ratio, quality, negative_prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("Gemini API not configured", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!aspect_ratio) {
      return new NextResponse("Aspect Ratio is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    console.log(prompt);
    const payload: Payload = {
      prompt,
      aspect_ratio,
      quality,
      guidance_scale: 20,
    };

    console.log(payload);

    // Conditionally add negative_prompt if it has some value
    if (negative_prompt) {
      payload.negative_prompt = negative_prompt;
    }

    const resp = await fetch(`https://api.limewire.com/api/image/generation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Version": "v1",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LIMEWIRE_API_KEY}	`,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();
    console.log(data);

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// run();
