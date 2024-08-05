/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import axios from "axios";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { content } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    const options = {
      method: "POST",
      url: "https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/",
      headers: {
        "x-rapidapi-key": "d95eff708emshbf6b829fcbd1f25p1c146bjsnf4c0ca982d09",
        "x-rapidapi-host": "ai-content-detector-ai-gpt.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        text: content,
      },
    };

    const response = await axios.request(options);
    console.log(response.data);

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[AI_DETECTION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// run();
