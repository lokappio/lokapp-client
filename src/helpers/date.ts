export const dateToDateTimeString = (date: Date): string =>
  date.toLocaleDateString() + " " + date.toLocaleTimeString()
