import { cn } from "@/lib/utils"

/**
 * Props for the Logo component
 */
interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  withText?: boolean
  darkMode?: boolean
}

/**
 * Logo component for Taskify Pro
 *
 * Renders the app logo with optional text. The logo is a checkmark in a rounded square,
 * representing task completion. The text uses a gradient effect for visual appeal.
 */
export default function Logo({ className, size = "md", withText = true, darkMode }: LogoProps) {
  // Size mappings for the logo SVG
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  // Size mappings for the logo text
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center", className)}>
      {/* Logo SVG */}
      <svg
        className={cn(sizeClasses[size], "text-blue-600 dark:text-blue-500 mr-2")}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="3"
          width="30"
          height="30"
          rx="8"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 18L16 22L24 14"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Logo text with gradient effect */}
      {withText && (
        <h1
          className={cn(
            textSizeClasses[size],
            "font-bold font-montserrat bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 bg-clip-text text-transparent",
          )}
        >
          Taskify Pro
        </h1>
      )}
    </div>
  )
}
