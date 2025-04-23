"use client"

import { useState, useEffect, useRef } from "react"
import { Bold, Italic, List, ListOrdered, Link, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      if (value) {
        editorRef.current.innerHTML = value
      } else {
        editorRef.current.innerHTML = ""
      }
    }
  }, [])

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Format commands
  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current?.focus()
  }

  const formatBold = () => execCommand("bold")
  const formatItalic = () => execCommand("italic")
  const formatUnorderedList = () => execCommand("insertUnorderedList")
  const formatOrderedList = () => execCommand("insertOrderedList")
  const formatCode = () => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      const range = selection.getRangeAt(0)
      const codeElement = document.createElement("code")
      codeElement.className = "bg-muted px-1 py-0.5 rounded text-sm font-mono"
      codeElement.textContent = selection.toString()
      range.deleteContents()
      range.insertNode(codeElement)
      handleInput()
    }
  }

  const formatLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      execCommand("createLink", url)
    }
  }

  return (
    <div className={`border rounded-md overflow-hidden ${isFocused ? "ring-2 ring-ring" : ""}`}>
      <div className="bg-muted/50 p-1 flex flex-wrap gap-1 items-center border-b">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatBold}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatItalic}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatUnorderedList}>
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatOrderedList}>
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatLink}>
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Insert Link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={formatCode}>
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Code</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-3 min-h-[150px] focus:outline-none"
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
