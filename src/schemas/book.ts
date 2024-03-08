import { z } from "zod";

export const bookCreationSchema = z.object({
  title: z.string(),
  author: z.string(),
  published: z.date().optional(),
  description: z.string(),
  pdf: z.string(),
  cover: z.string(),
});
