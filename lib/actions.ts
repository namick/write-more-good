"use server"

import { z } from "zod"

const FormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  improveGrammar: z.boolean().default(false),
  makeCreative: z.boolean().default(false),
  makeProfessional: z.boolean().default(false),
  translateToSpanish: z.boolean().default(false),
})

export type FormData = z.infer<typeof FormSchema>

export async function processContent(data: FormData) {
  const result = FormSchema.safeParse(data)
  
  if (!result.success) {
    return { error: "Invalid form data" }
  }

  try {
    // Here you would typically make a call to your AI API
    // For now, we'll just return a mock response
    console.log("Processing content:", data)
    
    return {
      success: true,
      message: "Content processed successfully",
      data: {
        originalContent: data.content,
        processedContent: `Processed: ${data.content}`,
        options: {
          improveGrammar: data.improveGrammar,
          makeCreative: data.makeCreative,
          makeProfessional: data.makeProfessional,
          translateToSpanish: data.translateToSpanish,
        }
      }
    }
  } catch (error) {
    console.error("Error processing content:", error)
    return { error: "Failed to process content" }
  }
}