import { z } from "zod";

export const userCreationSchema = z.object({
  name: z.string().optional(),
  username: z.string(),
  password: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
});
