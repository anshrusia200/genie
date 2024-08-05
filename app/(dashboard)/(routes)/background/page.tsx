"use client";

import { Heading } from "@/components/heading";
import * as z from "zod";
import {
  CheckCheck,
  Copy,
  Download,
  ImageIcon,
  BringToFront,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import Empty from "@/components/empty";
import toast from "react-hot-toast";

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
import { useDropzone } from "react-dropzone";
import { useProModal } from "@/hooks/use-pro-modal";

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
  const [copyState, setCopyState] = useState(false);
  const [image, setImage] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [removeUrl, setRemoveUrl] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setImageUrl(
      URL.createObjectURL(
        new Blob([acceptedFiles[0]], { type: acceptedFiles[0].type })
      )
    );
    setRemoveUrl("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "text/html": [".html", ".htm"],
    },
  });

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const apiKey = "nSf4gUXE2f3m3a1bYfMwunrg";

    try {
      const apiCheck = await axios.post("/api/background", formData);
      console.log(apiCheck.data);
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setRemoveUrl(url);
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
    const response = await fetch(removeUrl);
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

  return (
    <div className="h-[90vh]">
      <Heading
        title="Background Remover"
        description="Remove the background and focus on you"
        icon={BringToFront}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />

      <div className="px-4 lg:px-8 h-[85%] flex flex-col justify-between">
        <div className="relative space-y-4 mt-4 overflow-auto hideScroll h-full scroll-smooth">
          {loading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {/* {image.length === 0 && !loading && <EmptyImage />} */}
          {!file && (
            <div className="container flex justify-center items-center p-10">
              <div
                {...getRootProps()}
                className="dropzone border-2 border-dashed border-orange-500 w-[250px] h-[200px] sm:w-[400px]  md:w-[400px] md:h-[300px] lg:w-[700px] bg-orange-500/10 rounded-lg flex justify-center items-center"
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-xl text-orange-500 font-semibold">
                    Drop the files here ...
                  </p>
                ) : (
                  <p className="text-xl text-orange-500 font-semibold">
                    Drag n drop an image here, or click to select an image
                  </p>
                )}
              </div>
            </div>
          )}
          {file && (
            <div className="flex flex-col justify-center items-center gap-y-5 mt-2">
              <div className="flex w-full justify-evenly">
                <Card className="rounded-lg overflow-hidden px-3 border-2 border-pink-700/20">
                  <div className="flex justify-center pt-3">
                    <Image
                      alt="Image"
                      src={imageUrl}
                      width={320}
                      height={320}
                      className="rounded-lg min-w-[200px] max-h-[300px] object-contain pb-3"
                      style={{ maxHeight: "300px", width: "auto" }}
                    />
                  </div>
                  {file && (
                    <CardFooter className="w-full px-0 gap-x-2">
                      <Button
                        onClick={handleUpload}
                        variant="secondary"
                        className="w-full bg-orange-500/15 hover:bg-orange-500 hover:text-white text-orange-500"
                        disabled={removeUrl.length > 0}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload image
                      </Button>
                    </CardFooter>
                  )}
                </Card>
                {removeUrl && (
                  <Card className="rounded-lg overflow-hidden px-3 border-2 border-pink-700/20">
                    <div className="flex justify-center pt-3">
                      <Image
                        alt="Image"
                        src={removeUrl}
                        width={320}
                        height={320}
                        className="rounded-lg min-w-[200px] max-h-[300px] object-contain pb-3"
                        style={{ maxHeight: "300px", width: "auto" }}
                      />
                    </div>

                    <CardFooter className="w-full px-0 gap-x-2">
                      <Button
                        onClick={downloadImage}
                        variant="secondary"
                        className="w-full bg-orange-500/15 hover:bg-orange-500 hover:text-white text-orange-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download image
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
              <div
                className={cn(
                  "sm:w-[50%]",
                  removeUrl && "sm:w-[30%] md:w-[50%] mt-4"
                )}
              >
                <div className="container flex justify-center items-center w-[100%] h-[100px]">
                  <div
                    {...getRootProps()}
                    className="dropzone border-2 border-dashed border-orange-500 bg-orange-500/10 rounded-lg flex justify-center items-center w-[100%] h-[100%] px-5 text-justify"
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p className="text-xl text-orange-500 font-semibold">
                        Drop the files here ...
                      </p>
                    ) : (
                      <p className="text-xl text-orange-500 font-semibold">
                        Drag n drop or click to select an image
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
