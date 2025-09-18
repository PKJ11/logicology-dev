"use client";

import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

type CTAButtonProps = {
  text: string;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  bg?: string; // default: white
  color?: string; // default: brand teal (example)
  hoverBg?: string; // default: brand teal
  hoverColor?: string; // default: white
  size?: "sm" | "md" | "lg";
  roundedClass?: string; // e.g., "rounded-full" | "rounded-xl"
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export default function CTAButton({
  text,
  href,
  onClick,
  bg = "#FFFFFF",
  color = "#0A8A80",
  hoverBg = "#0A8A80",
  hoverColor = "#FFFFFF",
  size = "md",
  roundedClass = "rounded-full",
  leftIcon,
  rightIcon,
  className = "",
  ariaLabel,
}: CTAButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-4 py-2 text-sm"
      : size === "lg"
        ? "px-7 py-3.5 text-base"
        : "px-6 py-3 text-base";

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    ${roundedClass} ${sizeClasses}
    font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-white/70
    bg-[var(--btn-bg)] text-[var(--btn-color)]
    hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-color)]
  `;

  const style = {
    // Tailwind sees these class tokens; values come from CSS vars:
    // bg-[var(--btn-bg)] text-[var(--btn-color)] hover:bg-[var(--btn-hover-bg)] ...
    // We set the variables here:
    ["--btn-bg" as any]: bg,
    ["--btn-color" as any]: color,
    ["--btn-hover-bg" as any]: hoverBg,
    ["--btn-hover-color" as any]: hoverColor,
  } as React.CSSProperties;

  const content = (
    <span className={`${baseClasses} ${className}`} style={style} aria-label={ariaLabel}>
      {leftIcon}
      {text}
      {rightIcon}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} aria-label={ariaLabel} className="contents">
      {content}
    </button>
  );
}
