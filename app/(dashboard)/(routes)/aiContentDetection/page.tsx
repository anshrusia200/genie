"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import {
  MessageSquare,
  ArrowDown,
  NotebookPen,
  BotMessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import EmptySummary from "@/components/emptySummary";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

interface Part {
  text: string;
}

interface Message {
  role: string;
  parts: Part[];
}

const AiContentDetectionPage = () => {
  const proModal = useProModal();
  const maxLength = 1500;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [aiSentences, setAiSentences] = useState([]);
  const [aiWords, setAiWords] = useState();
  const [fakePercentage, setFakePercentage] = useState(0);
  const [textWords, setTextWords] = useState();
  const [status, setStatus] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/aiContentDetection", {
        ...values,
      });
      console.log(response.data);
      setAiSentences(response.data.aiSentences);
      setAiWords(response.data.aiWords);
      setTextWords(response.data.textWords);
      setFakePercentage(response.data.fakePercentage);
      setStatus(response.data.status);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  };

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      setShowScrollToBottom(false);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [aiSentences]);

  const handleScroll = () => {
    if (chatBoxRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatBoxRef.current;
      setShowScrollToBottom(scrollHeight - scrollTop > clientHeight * 1.2);
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShowScrollToBottom(false);
    }
  };

  return (
    <div className="h-[90vh]">
      <Heading
        title="AI content detector"
        description="Our most advanced conversation model"
        icon={BotMessageSquare}
        iconColor="text-yellow-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8 h-[85%] flex flex-col justify-between">
        <div
          ref={chatBoxRef}
          className="relative space-y-4 mt-4 overflow-auto hideScroll h-full scroll-smooth"
          onScroll={handleScroll}
        >
          {!status && !isLoading && <EmptySummary />}

          <div className="relative flex flex-col gap-y-4">
            {/* {messages.map((message, index) => ( */}
            {status && !isLoading && (
              <div className="flex p-8 space-x-8">
                {/* Left Card */}
                <Card className="w-1/3 bg-white rounded-lg shadow-md">
                  <CardHeader className="flex justify-center">
                    <h2 className="text-2xl font-bold mb-2">Fake Percentage</h2>
                    <div className="relative flex justify-center">
                      <div className="absolute w-16 h-16 bg-white rounded-full flex items-center justify-center top-[28%]">
                        <span className="text-xl font-bold">
                          {fakePercentage}%
                        </span>
                      </div>
                      <svg className="w-40 h-40">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="64"
                          cx="80"
                          cy="80"
                        />
                        <circle
                          className="text-red-600"
                          strokeWidth="8"
                          strokeDasharray="400"
                          strokeDashoffset={400 - (400 * fakePercentage) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="64"
                          cx="80"
                          cy="80"
                        />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent className="flex justify-between mt-1">
                    <div className="text-center">
                      <div className="text-2xl font-bold">AI Words</div>
                      <div className="text-lg font-semibold text-red-600">
                        {aiWords}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">Total Words</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {textWords}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Section */}
                <Card className="w-2/3 bg-white rounded-lg shadow-md">
                  <CardHeader>
                    <h2 className="text-2xl font-bold mb-2">AI Sentences</h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                      {aiSentences.map((sentence, index) => (
                        <li key={index} className="p-2 bg-gray-100 rounded-lg">
                          {sentence}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            {/* ))} */}
            {isLoading && (
              <div
                className={cn("flex justify-start w-full items-center my-1")}
              >
                <div className={cn("rounded bg-white mr-1")}>
                  <Loader />
                </div>
                <p> AI Genie is detecting</p>
              </div>
            )}
          </div>
          {showScrollToBottom && (
            <div className="flex w-full justify-center">
              <Button
                className={cn(
                  "fixed bottom-[110px] h-10 w-10 bg-white border-2 border-gray-300 shadow-sm  p-2 rounded-full hover:bg-white"
                )}
                onClick={scrollToBottom}
              >
                <ArrowDown className="text-black w-7 h-7 " />
              </Button>
            </div>
          )}
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      {/* <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Paste a url for an article or a blog and get its summary"
                        {...field}
                        ref={inputRef}
                      /> */}
                      <Textarea
                        disabled={isLoading}
                        maxLength={maxLength}
                        rows={6}
                        className="border-0 outline-none resize-none focus-visible:ring-0 focus-visible:ring-transparent"
                        placeholder="Type your text here..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-center space-y-2 col-span-12 lg:col-span-2">
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                >
                  Detect
                </Button>
                <Button
                  className="col-span-12 lg:col-span-2 w-full"
                  disabled={isLoading}
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AiContentDetectionPage;
