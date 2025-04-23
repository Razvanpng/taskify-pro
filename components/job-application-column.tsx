"use client"

import { useDrop } from "react-dnd"
import type { JobApplication, ApplicationStatus } from "@/lib/types"
import JobApplicationCard from "./job-application-card"
import { getStatusColor } from "@/lib/utils"

interface JobApplicationColumnProps {
  title: string
  status: ApplicationStatus
  applications: JobApplication[]
  onMoveApplication: (id: string, status: ApplicationStatus) => void
  onEditApplication: (application: JobApplication) => void
  onDeleteApplication: (id: string) => void
}

export default function JobApplicationColumn({
  title,
  status,
  applications,
  onMoveApplication,
  onEditApplication,
  onDeleteApplication,
}: JobApplicationColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "JOB_APPLICATION",
    drop: (item: { id: string }) => {
      onMoveApplication(item.id, status)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  const statusColor = getStatusColor(status)
  const borderColor = isOver ? "border-primary" : ""

  return (
    <div ref={drop} className={`bg-muted/50 rounded-lg p-3 min-h-[300px] ${borderColor} transition-colors`}>
      <div className="flex items-center mb-3">
        <h3 className={`text-sm font-medium ${statusColor} px-2 py-1 rounded-full`}>{title}</h3>
        <span className="ml-2 text-xs font-medium bg-muted px-2 py-1 rounded-full">{applications.length}</span>
      </div>

      <div className="space-y-3">
        {applications.map((application) => (
          <JobApplicationCard
            key={application.id}
            application={application}
            onEdit={() => onEditApplication(application)}
            onDelete={() => onDeleteApplication(application.id)}
            onStatusChange={(newStatus) => onMoveApplication(application.id, newStatus)}
          />
        ))}

        {applications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">Drag applications here</div>
        )}
      </div>
    </div>
  )
}
