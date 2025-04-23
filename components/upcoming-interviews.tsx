"use client"

import { useMemo } from "react"
import { format, isAfter, isBefore, addDays } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { JobApplication } from "@/lib/types"

interface UpcomingInterviewsProps {
  applications: JobApplication[]
}

export default function UpcomingInterviews({ applications }: UpcomingInterviewsProps) {
  const upcomingInterviews = useMemo(() => {
    const now = new Date()
    const nextWeek = addDays(now, 7)

    return applications
      .filter(
        (app) =>
          app.interviewDate &&
          isAfter(new Date(app.interviewDate), now) &&
          isBefore(new Date(app.interviewDate), nextWeek),
      )
      .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime())
  }, [applications])

  const pastInterviews = useMemo(() => {
    const now = new Date()

    return applications
      .filter((app) => app.interviewDate && isBefore(new Date(app.interviewDate), now))
      .sort((a, b) => new Date(b.interviewDate!).getTime() - new Date(a.interviewDate!).getTime())
      .slice(0, 3) // Show only the 3 most recent past interviews
  }, [applications])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingInterviews.length > 0 ? (
          <div className="space-y-4">
            {upcomingInterviews.map((app) => (
              <div key={app.id} className="border-l-4 border-primary pl-3 py-2">
                <div className="font-medium">{app.position}</div>
                <div className="text-sm text-muted-foreground">{app.company}</div>
                <div className="flex items-center mt-1 text-sm">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(app.interviewDate!), "EEEE, MMM d")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>No upcoming interviews</p>
            <p className="text-xs mt-1">Add interview dates to your applications</p>
          </div>
        )}

        {pastInterviews.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Recent Interviews</h3>
            <div className="space-y-3">
              {pastInterviews.map((app) => (
                <div key={app.id} className="border-l-4 border-muted pl-3 py-1">
                  <div className="font-medium text-sm">{app.position}</div>
                  <div className="text-xs text-muted-foreground">{app.company}</div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(app.interviewDate!), "MMM d, yyyy")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
