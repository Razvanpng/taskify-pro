"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, Trash2, ExternalLink, Calendar, DollarSign, MapPin, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { JobApplication, ApplicationStatus } from "@/lib/types"
import { useDrag } from "react-dnd"
import { getStatusColor } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

interface JobApplicationCardProps {
  application: JobApplication
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: ApplicationStatus) => void
}

export default function JobApplicationCard({ application, onEdit, onDelete, onStatusChange }: JobApplicationCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "JOB_APPLICATION",
    item: { id: application.id, status: application.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  const statusColor = getStatusColor(application.status)

  return (
    <>
      <Card ref={drag} className={`${isDragging ? "opacity-50" : "opacity-100"} transition-all cursor-grab`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={statusColor}>{application.status}</Badge>
              <CardTitle className="mt-2 text-lg">{application.position}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="font-medium">{application.company}</div>
            {application.location && (
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {application.location}
              </div>
            )}
            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              Applied {format(new Date(application.dateApplied), "MMM d, yyyy")}
            </div>
            {application.salary && (
              <div className="text-sm text-muted-foreground flex items-center">
                <DollarSign className="mr-1 h-3 w-3" />
                {application.salary}
              </div>
            )}
            {application.interviewDate && (
              <div className="text-sm font-medium text-primary flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                Interview on {format(new Date(application.interviewDate), "MMM d, yyyy")}
              </div>
            )}
          </div>

          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {application.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-1">
          <div className="flex justify-between w-full">
            <Button variant="ghost" size="sm" onClick={() => setShowDetails(true)}>
              View Details
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Move to
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange("applied")}>Applied</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("interviewing")}>Interviewing</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("offer")}>Offer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("rejected")}>Rejected</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("archived")}>Archived</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>

      {showDetails && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {application.position} at {application.company}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>
                    <Badge className={statusColor}>{application.status}</Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{application.location || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date Applied</h3>
                  <p>{format(new Date(application.dateApplied), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Salary</h3>
                  <p>{application.salary || "Not specified"}</p>
                </div>
                {application.interviewDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Interview Date</h3>
                    <p>{format(new Date(application.interviewDate), "MMMM d, yyyy")}</p>
                  </div>
                )}
                {application.jobPostingUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Job Posting</h3>
                    <a
                      href={application.jobPostingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      View Job Posting
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

              {(application.resumeFileName || application.coverLetterFileName) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Documents</h3>
                  <div className="flex gap-2">
                    {application.resumeFileName && (
                      <Badge variant="outline" className="flex items-center">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Resume: {application.resumeFileName}
                      </Badge>
                    )}
                    {application.coverLetterFileName && (
                      <Badge variant="outline" className="flex items-center">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Cover Letter: {application.coverLetterFileName}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {application.tags && application.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {application.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {application.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div dangerouslySetInnerHTML={{ __html: application.notes }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
