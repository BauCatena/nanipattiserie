import React from "react"

interface OptikHoverButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export function OptikHoverButton({
  title,
  description,
  icon,
  onClick,
  className,
}: OptikHoverButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className
          ? `optik-hover-button group ${className}`
          : "optik-hover-button group"
      }
    >
      <div className="optik-hover-button__icon">{icon}</div>
      <div className="text-left">
        <p className="optik-hover-button__title">{title}</p>
        <p className="optik-hover-button__description">{description}</p>
      </div>
    </button>
  )
}
