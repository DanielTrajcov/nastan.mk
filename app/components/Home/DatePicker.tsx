"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Date Selector Component
export const DateSelector = ({
  date,
  setDate,
  className,
}: {
  date: Date | null;
  setDate: (date: Date | null) => void;
  className?: string;
}) => {
  // Handle date selection with proper type checking
  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate || null);
  };

  // Safely format the date
  const formattedDate = React.useMemo(() => {
    try {
      return date ? format(date, "PPP") : "";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full py-6 justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          {formattedDate ? formattedDate : <span>Избери датум</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) => date < new Date("1900-01-01")}
        />
      </PopoverContent>
    </Popover>
  );
};

// Time Selector Component
export const TimeSelector = ({
  time,
  setTime,
  className,
}: {
  time: string;
  setTime: (time: string) => void;
  className?: string;
}) => (
  <Select value={time} onValueChange={(newTime) => setTime(newTime)}>
    <SelectTrigger className={cn("w-full", className)}>
      <SelectValue placeholder="Избери време" />
    </SelectTrigger>
    <SelectContent>
      {Array.from({ length: 24 * 4 }).map((_, i) => {
        const hour = Math.floor(i / 4);
        const minute = (i % 4) * 15;
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        return (
          <SelectItem key={timeString} value={timeString}>
            {timeString}
          </SelectItem>
        );
      })}
    </SelectContent>
  </Select>
);
