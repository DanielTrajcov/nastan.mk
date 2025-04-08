import { format } from "date-fns";
import { mk } from "date-fns/locale";

export const formatMacedonianDate = (date: Date): string => {
  return format(date, "EEEE, d MMMM yyyy", { locale: mk });
};

export const formatTime = (date: Date): string => {
  return format(date, "HH:mm", { locale: mk });
};
