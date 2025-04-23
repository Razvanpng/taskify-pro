import { Skeleton } from "@/components/ui/skeleton"

export default function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 animate-pulse" aria-hidden="true">
      <div className="flex items-start gap-3">
        <div className="pt-1">
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="flex-grow">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-6 w-28 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
