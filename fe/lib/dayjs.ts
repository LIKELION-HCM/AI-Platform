import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// Guess user's timezone
const userTimezone = dayjs.tz.guess();

// Helper functions
export const formatDate = (date: string | Date, format: string = "DD MMM YYYY HH:mm") => {
  return dayjs(date).tz(userTimezone).format(format);
};

export const formatRelativeTime = (date: string | Date) => {
  return dayjs(date).tz(userTimezone).fromNow();
};

export const parseAndFormat = (date: string | Date) => {
  return dayjs.utc(date).tz(userTimezone);
};

export { dayjs };
export default dayjs;