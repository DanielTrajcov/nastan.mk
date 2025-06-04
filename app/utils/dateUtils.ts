import { format } from "date-fns";
import { mk } from "date-fns/locale";

export const formatMacedonianDate = (input?: string | Date | number): string => {
  if (!input) return "";
  let date: Date;
  if (typeof input === "number") {
    date = new Date(input);
  } else if (typeof input === "string") {
    date = new Date(input);
  } else {
    date = input;
  }
  return format(date, "EEEE, d MMMM yyyy", { locale: mk });
};

export const formatTime = (input?: string | Date | number): string => {
  if (!input) return "";
  let date: Date;
  if (typeof input === "number") {
    date = new Date(input);
  } else if (typeof input === "string") {
    date = new Date(input);
  } else {
    date = input;
  }
  return format(date, "HH:mm", { locale: mk });
};
