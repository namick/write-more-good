'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { processContent, type FormData } from '@/lib/actions'
import { Loader2 } from 'lucide-react'

interface Options {
  improveGrammar: boolean
  makeCreative: boolean
  makeProfessional: boolean
  keepLength: boolean
}

export function ContentForm() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [options, setOptions] = useState<Options>({
    improveGrammar: false,
    makeCreative: false,
    makeProfessional: false,
    keepLength: false,
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
        <Textarea
          id="content"
          placeholder="excellent words..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionCheckbox
            label="Grammar"
            optionId="improveGrammar"
            setOptions={setOptions}
            options={options}
          />

          <OptionCheckbox
            label="More Creative"
            optionId="makeCreative"
            setOptions={setOptions}
            options={options}
          />

          <OptionCheckbox
            label="More Professional"
            optionId="makeProfessional"
            setOptions={setOptions}
            options={options}
          />

          <OptionCheckbox
            label="Keep Length"
            optionId="keepLength"
            setOptions={setOptions}
            options={options}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Improve this writing'
        )}
      </Button>

      {result && (
        <div className="mt-8 p-4 rounded-lg bg-muted">
          <Label>Suggestions:</Label>
          <p className="mt-2 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </form>
  )
}

interface OptionCheckboxProps {
  label: string
  optionId: keyof Options
  options: Options
  setOptions: Dispatch<SetStateAction<Options>>
}

function OptionCheckbox({
  label,
  optionId,
  options,
  setOptions
}: OptionCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={optionId}
        checked={options[optionId]}
        onCheckedChange={(checked) =>
          setOptions((prev) => ({
            ...prev,
            [optionId]: checked === true,
          }))
        }
      />
      <Label htmlFor={optionId}>{label}</Label>
    </div>
  )
}
