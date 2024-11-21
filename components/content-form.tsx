'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { processContent, type FormData } from '@/lib/actions'
import { Loader2 } from 'lucide-react'

export function ContentForm() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [options, setOptions] = useState({
    improveGrammar: false,
    makeCreative: false,
    makeProfessional: false,
    translateToSpanish: false,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData: FormData = {
        content,
        ...options,
      }

      const response = await processContent(formData)

      if ('error' in response) {
        setResult(response.error || '')
      } else {
        setResult(response.data.processedContent)
      }
    } catch (error) {
      setResult('An error occurred while processing your content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="content">Your Content</Label>
        <Textarea
          id="content"
          placeholder="Enter your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="improveGrammar"
              checked={options.improveGrammar}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({
                  ...prev,
                  improveGrammar: checked === true,
                }))
              }
            />
            <Label htmlFor="improveGrammar">Improve Grammar</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeCreative"
              checked={options.makeCreative}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({
                  ...prev,
                  makeCreative: checked === true,
                }))
              }
            />
            <Label htmlFor="makeCreative">Make Creative</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="makeProfessional"
              checked={options.makeProfessional}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({
                  ...prev,
                  makeProfessional: checked === true,
                }))
              }
            />
            <Label htmlFor="makeProfessional">Make Professional</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="keepLength"
              checked={options.translateToSpanish}
              onCheckedChange={(checked) =>
                setOptions((prev) => ({
                  ...prev,
                  translateToSpanish: checked === true,
                }))
              }
            />
            <Label htmlFor="keepLength">Keep Length</Label>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Process Content'
        )}
      </Button>

      {result && (
        <div className="mt-8 p-4 rounded-lg bg-muted">
          <Label>Result:</Label>
          <p className="mt-2 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </form>
  )
}
