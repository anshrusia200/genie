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

import axios from "axios";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { checkSubscription } from "@/lib/subscription";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { text, speed, voice_code } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("Gemini API not configured", { status: 500 });
    }
    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }
    if (!voice_code) {
      return new NextResponse("Voice code is required", { status: 400 });
    }
    if (!speed) {
      return new NextResponse("Speed is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    const data = new FormData();
    data.append("voice_code", voice_code);
    data.append("text", text);
    data.append("speed", speed);
    data.append("pitch", "1.00");
    data.append("output_type", "audio_url");
    const api = "https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize";
    const options = {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_CLOUDLABS_API_KEY,
        "x-rapidapi-host": "cloudlabs-text-to-speech.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios.post(api, data, options);
    console.log(response.data);
    console.log(data);

    
    if (!isPro) {
      await increaseApiLimit();
    }


    return NextResponse.json(response.data);
  } catch (error) {
    console.log("[SPEECH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// run();
