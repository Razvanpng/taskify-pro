"use client"

import type React from "react"

import { useState, useRef } from "react"
import { CalendarIcon, X, Plus, Upload, File, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { JobApplication, ApplicationStatus } from "@/lib/types"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { RichTextEditor } from "./rich-text-editor"

interface JobApplicationFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (application: JobApplication | Omit<JobApplication, "id">) => void
  initialData?: JobApplication | null
  existingTags: string[]
}

export default function JobApplicationForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingTags,
}: JobApplicationFormProps) {
  const [company, setCompany] = useState(initialData?.company || "")
  const [position, setPosition] = useState(initialData?.position || "")
  const [location, setLocation] = useState(initialData?.location || "")
  const [status, setStatus] = useState<ApplicationStatus>(initialData?.status || "applied")
  const [dateApplied, setDateApplied] = useState<Date>(
    initialData?.dateApplied ? new Date(initialData.dateApplied) : new Date(),
  )
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(
    initialData?.interviewDate ? new Date(initialData.interviewDate) : undefined,
  )
  const [salary, setSalary] = useState(initialData?.salary || "")
  const [jobPostingUrl, setJobPostingUrl] = useState(initialData?.jobPostingUrl || "")
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState<File | null>(null)
  const [resumeFileName, setResumeFileName] = useState(initialData?.resumeFileName || "")
  const [coverLetterFileName, setCoverLetterFileName] = useState(initialData?.coverLetterFileName || "")

  const resumeInputRef = useRef<HTMLInputElement>(null)
  const coverLetterInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const application: JobApplication | Omit<JobApplication, "id"> = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      company,
      position,
      location,
      status,
      dateApplied: dateApplied.toISOString(),
      interviewDate: interviewDate?.toISOString(),
      salary,
      jobPostingUrl,
      notes,
      tags,
      resumeFileName: resume ? resume.name : resumeFileName,
      coverLetterFileName: coverLetter ? coverLetter.name : coverLetterFileName,
    }

    onSubmit(application)
  }

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0])
      setResumeFileName(e.target.files[0].name)
    }
  }

  const handleCoverLetterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverLetter(e.target.files[0])
      setCoverLetterFileName(e.target.files[0].name)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Job Application" : "Add New Job Application"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as ApplicationStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Applied</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateApplied && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateApplied ? format(dateApplied, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateApplied}
                        onSelect={(date) => date && setDateApplied(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Interview Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !interviewDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {interviewDate ? format(interviewDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={interviewDate} onSelect={setInterviewDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (Optional)</Label>
                  <Input
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. $80,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobPostingUrl">Job Posting URL (Optional)</Label>
                <Input
                  id="jobPostingUrl"
                  value={jobPostingUrl}
                  onChange={(e) => setJobPostingUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {existingTags.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Existing tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {existingTags
                        .filter((tag) => !tags.includes(tag))
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => setTags([...tags, tag])}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Resume (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resumeInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {resumeFileName ? "Change Resume" : "Upload Resume"}
                    </Button>
                    {resumeFileName && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setResume(null)
                          setResumeFileName("")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                  {resumeFileName && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                      <File className="h-4 w-4" />
                      <span className="truncate">{resumeFileName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cover Letter (PDF)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => coverLetterInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {coverLetterFileName ? "Change Cover Letter" : "Upload Cover Letter"}
                    </Button>
                    {coverLetterFileName && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setCoverLetter(null)
                          setCoverLetterFileName("")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={coverLetterInputRef}
                    onChange={handleCoverLetterUpload}
                    accept=".pdf"
                    className="hidden"
                  />
                  {coverLetterFileName && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                      <File className="h-4 w-4" />
                      <span className="truncate">{coverLetterFileName}</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <RichTextEditor value={notes} onChange={setNotes} placeholder="Add notes about this application..." />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"} Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
