import { z } from "zod";

export const FileResponseSchema = z.object({
  filePath: z.string(),
  fileName: z.string(),
  mimeType: z.enum(["application/pdf", "text/plain"]),
});

export type FileResponse = z.infer<typeof FileResponseSchema>;
