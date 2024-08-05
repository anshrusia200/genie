import * as z from "zod";

export const formSchema = z.object({
  url: z.string().min(1, {
    message: "URL is required",
  }),
});
