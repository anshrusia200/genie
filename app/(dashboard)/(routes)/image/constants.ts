import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  aspect_ratio: z.string().min(1),
  negative_prompt: z.string(),
});

export const aspectOptions = [
  {
    value: "1:1",
    label: "1:1",
  },
  {
    value: "13:19",
    label: "13:19",
  },
  {
    value: "19:13",
    label: "19:13",
  },
];
