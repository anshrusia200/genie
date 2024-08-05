"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BringToFront,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  SpeakerIcon,
  Speech,
  NotebookPen,
  BotMessageSquare,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/conversation",
  },
  {
    label: "Speech Generation",
    icon: Speech,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/speech",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/image",
  },
  {
    label: "Background Remover",
    icon: BringToFront,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: "/background",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: "/code",
  },
  {
    label: "Summarizer",
    icon: NotebookPen,
    href: "/summary",
    color: "text-red-500",
  },
  {
    label: "AI Content Detector",
    icon: BotMessageSquare,
    href: "/aiContentDetection",
    color: "text-yellow-500",
  },
];

const DashboardPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:tect-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground  font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{tool.label}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
