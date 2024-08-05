"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import { MessageSquare, ArrowDown, NotebookPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const ConversationPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [summary, setSummary] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/summary", {
        ...values,
      });
      console.log(response.data);
      setSummary(response.data.summary);
      form.reset();
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
  }, [summary]);

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
        title="Summarizer"
        description="Our most advanced conversation model"
        icon={NotebookPen}
        iconColor="text-red-500"
        bgColor="bg-violet-500/10"
      />

      <div className="px-4 lg:px-8 h-[85%] flex flex-col justify-between">
        <div
          ref={chatBoxRef}
          className="relative space-y-4 mt-4 overflow-auto hideScroll h-full scroll-smooth"
          onScroll={handleScroll}
        >
          {summary.length === 0 && !isLoading && <EmptySummary />}

          <div className="relative flex flex-col gap-y-4">
            {/* {messages.map((message, index) => ( */}
            {summary && (
              <div className={cn("flex items-start justify-center")}>
                <div className="w-10 h-10 relative mr-1">
                  <Image alt="logo" fill src="/logo.png" />
                </div>
                <div className={cn("p-3 rounded bg-gray-100 w-full pt-1")}>
                  <pre className="whitespace-pre-wrap break-words">
                    {summary}
                  </pre>
                </div>
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
                <p> AI Genie is summarizing</p>
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
                name="url"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Paste a url for an article or a blog and get its summary"
                        {...field}
                        ref={inputRef}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
