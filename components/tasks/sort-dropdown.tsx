"use client"

import type { SortOption } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowUpDown, Calendar, CheckCircle } from "lucide-react"
import { getSortOptionLabel } from "@/lib/utils"

interface SortDropdownProps {
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
}

export default function SortDropdown({ sortOption, setSortOption }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-xl w-[180px] justify-start">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {getSortOptionLabel(sortOption)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={() => setSortOption("created")}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          Newest First
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("deadline")}>
          <Calendar className="mr-2 h-4 w-4" />
          Earliest Deadline
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("priority")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Highest Priority
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortOption("completion")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Incomplete First
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
