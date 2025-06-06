import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
  };
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({
  image,
  title,
  subtitle,
  children,
  className,
  onClick,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm overflow-hidden p-4",
        hoverable && "transition-all duration-200 hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {image && (
        <div className={cn("relative w-full", image.containerClassName)}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className={cn("object-cover rounded-lg", image.className)}
          />
        </div>
      )}
      <div className="py-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        )}
        {subtitle && <p className="text-sm text-gray-500 mb-3">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
