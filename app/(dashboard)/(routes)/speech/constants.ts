import * as z from "zod";

export const formSchema = z.object({
  text: z.string().min(1, {
    message: "Text is required",
  }),
  voice_code: z.string().min(1),
  speed: z.number().min(0.1),
});

export const voiceOptions = [
  {
    value: "en-GB-1",
    label: "English (UK) - Female",
  },
  {
    value: "en-GB-2",
    label: "English (UK) - Male",
  },
  {
    value: "en-IN-1",
    label: "English (India) - Female",
  },
  {
    value: "en-IN-2",
    label: "English (India) - Male",
  },
  {
    value: "en-US-1",
    label: "English (US) - Female",
  },
  {
    value: "en-US-2",
    label: "English (US) - Male",
  },
];
