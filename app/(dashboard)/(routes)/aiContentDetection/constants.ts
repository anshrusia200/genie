import * as z from "zod";

export const formSchema = z.object({
  content: z.string().min(1, {
    message: "URL is required",
  }),
});
