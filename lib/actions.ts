'use server'

import { z } from 'zod'
import ky from 'ky'
import { xai_key } from '@/config'

console.log('XAI API Key:', xai_key)

const FormSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  improveGrammar: z.boolean().default(false),
  makeCreative: z.boolean().default(false),
  makeProfessional: z.boolean().default(false),
  keepLength: z.boolean().default(false),
})

type CompletionsResponse = {
  choices: {
    finish_reason: string
    index: number
    text: string
  }[]
  created: number
  id: string
  model: 'grok-beta' | 'grok-vision-beta'
  object: string
  system_fingerprint: string
  usage: {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }
}

export type FormData = z.infer<typeof FormSchema>

export async function processContent(data: FormData) {
  const result = FormSchema.safeParse(data)

  if (!result.success) {
    return { error: 'Invalid form data' }
  }

  try {
    console.log('Processing content:', data)
    const prompt = generatePrompt(data)

    const requestData = {
      prompt,
      model: 'grok-beta',
      max_tokens: 1000,
      temperature: 0,
    }

    const response = await ky
      .post('https://api.x.ai/v1/completions', {
        json: requestData,
        headers: {
          Authorization: `Bearer ${xai_key}`,
        },
      })
      .json<CompletionsResponse>()

    console.log('Response:', response.choices[0].text)
    console.log('Finish reason:', response.choices[0].finish_reason)

    return {
      success: true,
      message: 'Content processed successfully',
      data: {
        originalContent: data.content,
        processedContent: response.choices[0].text,
        options: {
          improveGrammar: data.improveGrammar,
          makeCreative: data.makeCreative,
          makeProfessional: data.makeProfessional,
          keepLength: data.keepLength,
        },
      },
    }
  } catch (error) {
    console.error('Error processing content:', error)
    return { error: 'Failed to process content', message: error }
  }
}

function generatePrompt(data: FormData) {
  const prompt =
    'You are an API endpoint and respond only with a single JSON object. Please review this text and make changes to improve it.  Make sure to follow these rules: \n' +
    (data.improveGrammar ? '- Improve grammar and correct spelling.\n' : '') +
    (data.makeCreative ? '- Make it more creative.\n' : '') +
    (data.makeProfessional ? '- Make it more professional.\n' : '') +
    (data.keepLength ? '- Keep the length the same.\n' : '') +
    '- Most importantly, make sure to respond only with JSON object that has the following structure.\n' +
    'The JSON object must have only two properties, "revised_text" and "suggestions". ' +
    'The "revised_text" property should contain the revised text, and the "suggestions" property should contain an array of suggestions. \n\n' +
    '- Respond only with the textual JSON structure in valid and parsable format. \n\n' +
    'Here is the original text: \n\n' +
    data.content

  return prompt
}
