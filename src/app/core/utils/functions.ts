import { formatDate } from "@angular/common";

export const getDateString = (value: string | Date) => {
  if (!value) {
    return null;
  }

  return formatDate(value, "dd.MM.yyyy", "en-US");
};
