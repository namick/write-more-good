"use server"

import { z } from "zod"

const FormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  improveGrammar: z.boolean().default(false),
  makeCreative: z.boolean().default(false),
  makeProfessional: z.boolean().default(false),
  keepLength: z.boolean().default(false),
})


export type FormData = z.infer<typeof FormSchema>

export async function processContent(data: FormData) {
  const result = FormSchema.safeParse(data)

  if (!result.success) {
    return { error: "Invalid form data" }
  }

  try {
    console.log("Processing content:", data)

    return {
      success: true,
      message: "Content processed successfully",
      data: {
        originalContent: data.content,
        processedContent: `${data.content} with changes...`,
        options: {
          improveGrammar: data.improveGrammar,
          makeCreative: data.makeCreative,
          makeProfessional: data.makeProfessional,
          keepLength: data.keepLength,
        }
      }
    }
  } catch (error) {
    console.error("Error processing content:", error)
    return { error: "Failed to process content" }
  }
}