import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image_file") as File;
    // console.log(file);
    if (!file) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }


    // const formData: FormData = new FormData();
    // formData.append("size", "auto");
    // formData.append("image_file", file);

    // const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    //   method: "POST",
    //   headers: {
    //     "X-Api-Key": "nSf4gUXE2f3m3a1bYfMwunrg",
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: formData as any,
    // });

    console.log("Limit increase");
    
    if (!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse("continue with bg remover", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
