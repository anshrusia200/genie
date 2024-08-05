"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import { ArrowDown, Download, ImageIcon, Speech } from "lucide-react";
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
import Empty from "@/components/empty";
import useDownloader from "react-use-downloader";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { voiceOptions } from "./constants";
import { Switch } from "@/components/ui/switch";
import EmptySpeech from "@/components/emptySpeech";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { format } from "path/posix";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

interface Part {
  text: string;
}

interface Message {
  role: string;
  parts: Part[];
}

const SpeechPage = () => {
  const proModal = useProModal();
  const maxLength = 150;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [speech, setSpeech] = useState("");
  const [negative, setNegative] = useState(false);
  const [voice, setVoice] = useState<string>("voice of AI Genie");
  const [text, setText] = useState<string>("Test Phrase");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      voice_code: "en-GB-1",
      speed: 1,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const voiceLabel = voiceOptions.find((opt) => {
        return opt.value == values.voice_code;
      })?.label;

      setVoice(`voice of ${voiceLabel}` || "voice of AI Genie");
      setText(values.text);
      setSpeech("");
      const response = await axios.post("/api/speech", values);
      console.log(response.data);
      if (response.data.status == "success") {
        setSpeech(response.data.result.audio_url);
      } else {
        setSpeech("");
      }

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log(form);
  }, [form]);

  const fileUrl = speech;
  const filename = "beautiful-carpathia.jpg";

  return (
    <div className="h-[90vh]">
      <Heading
        title="Text To Speech Generation"
        description="Turn your text to speech"
        icon={Speech}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />

      <div className="px-4 lg:px-8 h-[85%] flex flex-col justify-between">
        <div className="relative space-y-4 mt-4 overflow-auto hideScroll h-full scroll-smooth">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {speech === "" && !isLoading && <EmptySpeech />}
          {speech != "" && (
            <div className=" flex justify-center mt-2">
              <Card className="rounded-lg p-4 overflow-hidden w-[80%]">
                <CardHeader>
                  <h2 className="text-2xl m-0 font-bold">
                    Here is your text in the {voice}
                  </h2>
                  <p className="mt-[100px]">{text}</p>
                </CardHeader>
                <div>
                  <audio controls className="w-[100%] bg-[]">
                    <source src={speech} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 my-2 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <div className="grid grid-cols-12 col-span-12">
                <div className="col-span-12 lg:col-span-8">
                  <FormField
                    name="text"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl className="m-0 p-0">
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
                </div>
                <div className=" flex flex-col gap-y-2 lg:col-span-4">
                  <div className="flex gap-x-2 justify-between items-center  lg:col-span-4">
                    <div className="flex flex-col w-[70%]">
                      <p className="text-md">Voice</p>
                      <FormField
                        control={form.control}
                        name="voice_code"
                        render={({ field }) => (
                          <FormItem className="">
                            <Select
                              disabled={isLoading}
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue defaultValue={field.value} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {voiceOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md">Speed</p>
                      <FormField
                        name="speed"
                        render={({ field }) => (
                          <FormItem className="col-span-12 lg:col-span-1">
                            <FormControl className="m-0 p-0">
                              <Input
                                className="focus-visible:ring-0 text-center focus-visible:ring-transparent p-1"
                                disabled={isLoading}
                                {...field}
                                ref={inputRef}
                                type="number"
                                min={0.1}
                                max={3}
                                step={0.1}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    className="col-span-12 lg:col-span-2 w-full"
                    disabled={isLoading}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              {/*  add other items here */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SpeechPage;
