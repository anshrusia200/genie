"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import { MessageSquare, ArrowDown, Code } from "lucide-react";
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
import EmptyCode from "@/components/emptyCode";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";


interface Part {
  text: string;
}

interface Message {
  role: string;
  parts: Part[];
}

const CodePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = {
        role: "user",
        parts: [{ text: values.prompt }],
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      const response = await axios.post("/api/code", {
        messages: newMessages,
      });
      setMessages(response.data);
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
  }, [messages]);

  const handleScroll = () => {
    console.log("hi");
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
        title="Code Generation"
        description="Generate code with descriptive prompts"
        icon={Code}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />

      <div className="px-4 lg:px-8 h-[85%] flex flex-col justify-between">
        <div
          ref={chatBoxRef}
          className="relative space-y-4 mt-4 overflow-auto hideScroll h-full scroll-smooth"
          onScroll={handleScroll}
        >
          {messages.length === 0 && !isLoading && <EmptyCode />}
          <div className="relative flex flex-col gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "model" && (
                  <div className="w-10 h-10 relative">
                    <Image alt="logo" fill src="/logo.png" />
                  </div>
                )}
                {message.role === "user" ? (
                  <div
                    className={cn(
                      "p-3 bg-gray-200 text-right rounded-full px-4"
                    )}
                  >
                    {message.parts[0].text}
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/10 rounded-lg p-1"
                          {...props}
                        />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7 ml-2"
                  >
                    {message.parts[0].text || ""}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {isLoading && (
              <div
                className={cn("flex justify-start w-full items-center my-1")}
              >
                <div className={cn("rounded bg-white")}>
                  <Loader />
                </div>
                <p> AI Genie is thinking</p>
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
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Write a basic toggle button in react"
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

export default CodePage;
