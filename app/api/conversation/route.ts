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

// import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!apiKey) {
      return new NextResponse("Gemini API not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    // const freeTrial = await checkApiLimit();

    // if (!freeTrial) {
    //   return new NextResponse("Free Trial has expired", {
    //     status: 403,
    //   });
    // }

    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: messages.slice(0, -1),
    });

    const result = await chatSession.sendMessage(
      messages[messages.length - 1].parts[0].text
    );
    const newMessage = {
      role: "model",
      parts: [{ text: result.response.text() }],
    };
    const updatedMessages = [...messages, newMessage];
    console.log(updatedMessages);

    // await increaseApiLimit();
    return NextResponse.json(updatedMessages);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// run();
