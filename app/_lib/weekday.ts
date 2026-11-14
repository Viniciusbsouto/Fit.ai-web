export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const WEEKDAY_ORDER: WeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const WEEKDAY_UPPER: Record<WeekDay, string> = {
  MONDAY: "SEGUNDA",
  TUESDAY: "TERÇA",
  WEDNESDAY: "QUARTA",
  THURSDAY: "QUINTA",
  FRIDAY: "SEXTA",
  SATURDAY: "SÁBADO",
  SUNDAY: "DOMINGO",
};

const WEEKDAY_TITLE: Record<WeekDay, string> = {
  MONDAY: "Segunda",
  TUESDAY: "Terça",
  WEDNESDAY: "Quarta",
  THURSDAY: "Quinta",
  FRIDAY: "Sexta",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const WEEKDAY_SHORT: Record<WeekDay, string> = {
  MONDAY: "S",
  TUESDAY: "T",
  WEDNESDAY: "Q",
  THURSDAY: "Q",
  FRIDAY: "S",
  SATURDAY: "S",
  SUNDAY: "D",
};

export const weekdayUpper = (weekDay: WeekDay) => WEEKDAY_UPPER[weekDay];

export const weekdayTitle = (weekDay: WeekDay) => WEEKDAY_TITLE[weekDay];

export const weekdayShort = (weekDay: WeekDay) => WEEKDAY_SHORT[weekDay];

import type dayjs from "dayjs";

export const weekdayFromDate = (date: dayjs.Dayjs): WeekDay => {
  const mapping = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;
  return mapping[date.day()];
};

export const weekdayIndexOf = (weekDay: WeekDay): number => {
  return WEEKDAY_ORDER.indexOf(weekDay);
};

export function getWeekDates(today: dayjs.Dayjs): dayjs.Dayjs[] {
  const monday =
    today.day() === 0
      ? today.subtract(6, "day")
      : today.subtract(today.day() - 1, "day");

  return Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));
}
