"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import { ArrowDown, CheckCheck, Copy, Download, ImageIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { aspectOptions } from "./constants";
import { Switch } from "@/components/ui/switch";
import EmptyImage from "@/components/emptyImage";
import { Card, CardFooter } from "@/components/ui/card";
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

const ImagePage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [negative, setNegative] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      aspect_ratio: "19:13",
      negative_prompt: "",
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImage([]);
      console.log({ ...values, quality: "LOW" });
      const response = await axios.post("/api/image", {
        ...values,
        quality: "LOW",
      });
      console.log(response.data);
      if (response.data.status === "COMPLETED") {
        setImage([response.data.data[0].asset_url]);
        console.log(image[0]);
      } else {
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

  const downloadImage = async () => {
    const imageUrl = image[0];
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyHandler = () => {
    setCopyState(true);
    setTimeout(() => {
      setCopyState(false);
    }, 2000);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log(form);
  }, [image, form]);

  return (
    <div className="h-[90vh]">
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image"
        icon={ImageIcon}
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
          {image.length === 0 && !isLoading && <EmptyImage />}
          {image.length > 0 && (
            <div className=" flex justify-center mt-2">
              <Card className="rounded-lg overflow-hidden min-w-[350px] border-2 border-pink-700/20">
                <div className="flex justify-center py-3">
                  <img
                    alt="Image"
                    src={image[0]}
                    width={320}
                    height={320}
                    className="rounded-lg"
                  />
                </div>
                <CardFooter className="p-2 gap-x-2">
                  <Button
                    onClick={downloadImage}
                    variant="secondary"
                    className="w-[50%] bg-pink-700/10 hover:bg-pink-700 hover:text-white text-pink-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={copyHandler}
                    variant="secondary"
                    className="w-[50%] bg-pink-700/10 hover:bg-pink-700 hover:text-white text-pink-700 p-auto"
                  >
                    {copyState ? (
                      <>
                        <CheckCheck className="h-5 w-5 mr-2" />
                        Copied URL
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Image URL
                      </>
                    )}
                  </Button>
                </CardFooter>
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
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-8">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Dog on a bicycle"
                        {...field}
                        ref={inputRef}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-2">
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
                        {aspectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>

              <div className="flex col-span-12">
                <Switch
                  checked={negative}
                  onCheckedChange={() => setNegative(!negative)}
                />
                <p className="mx-2">Negative Prompt</p>
              </div>
              {negative && (
                <FormField
                  name="negative_prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-8">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                          disabled={isLoading}
                          placeholder="Don't show black dog"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
