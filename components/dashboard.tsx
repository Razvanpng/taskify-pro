"use client"

import { useMemo } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { JobApplication } from "@/lib/types"
import { getStatusColor } from "@/lib/utils"

interface DashboardProps {
  applications: JobApplication[]
}

export default function Dashboard({ applications }: DashboardProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalCount = applications.length

    const statusCounts = {
      applied: applications.filter((app) => app.status === "applied").length,
      interviewing: applications.filter((app) => app.status === "interviewing").length,
      offer: applications.filter((app) => app.status === "offer").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
      archived: applications.filter((app) => app.status === "archived").length,
    }

    // Calculate response rate (interviewing + offer + rejected) / total
    const responseRate =
      totalCount > 0
        ? (((statusCounts.interviewing + statusCounts.offer + statusCounts.rejected) / totalCount) * 100).toFixed(1)
        : "0"

    // Calculate success rate (offer) / (interviewing + offer + rejected)
    const successRate =
      statusCounts.interviewing + statusCounts.offer + statusCounts.rejected > 0
        ? (
            (statusCounts.offer / (statusCounts.interviewing + statusCounts.offer + statusCounts.rejected)) *
            100
          ).toFixed(1)
        : "0"

    // Group applications by month for the chart
    const last6Months = new Array(6)
      .fill(0)
      .map((_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
          month: date.toLocaleString("default", { month: "short" }),
          timestamp: date.getTime(),
        }
      })
      .reverse()

    const applicationsByMonth = last6Months.map(({ month, timestamp }) => {
      const startOfMonth = new Date(timestamp)
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const endOfMonth = new Date(timestamp)
      endOfMonth.setMonth(endOfMonth.getMonth() + 1)
      endOfMonth.setDate(0)
      endOfMonth.setHours(23, 59, 59, 999)

      const count = applications.filter((app) => {
        const appDate = new Date(app.dateApplied)
        return appDate >= startOfMonth && appDate <= endOfMonth
      }).length

      return { month, count }
    })

    // Prepare data for pie chart
    const pieData = [
      { name: "Applied", value: statusCounts.applied, color: getStatusColor("applied") },
      { name: "Interviewing", value: statusCounts.interviewing, color: getStatusColor("interviewing") },
      { name: "Offer", value: statusCounts.offer, color: getStatusColor("offer") },
      { name: "Rejected", value: statusCounts.rejected, color: getStatusColor("rejected") },
      { name: "Archived", value: statusCounts.archived, color: getStatusColor("archived") },
    ].filter((item) => item.value > 0)

    return {
      totalCount,
      statusCounts,
      responseRate,
      successRate,
      applicationsByMonth,
      pieData,
    }
  }, [applications])

  if (applications.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCount}</div>
          <p className="text-xs text-muted-foreground">{stats.statusCounts.offer} offers received</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.responseRate}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.statusCounts.interviewing + stats.statusCounts.offer + stats.statusCounts.rejected} responses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">Of applications with responses</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.statusCounts.applied + stats.statusCounts.interviewing}</div>
          <p className="text-xs text-muted-foreground">{stats.statusCounts.interviewing} in interview stage</p>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 md:row-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="h-[200px] w-full max-w-[200px]">
            {stats.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color.split(" ")[0]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Applications Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.applicationsByMonth}>
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                              <span className="font-bold text-muted-foreground">{payload[0].payload.month}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">Applications</span>
                              <span className="font-bold">{payload[0].value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
