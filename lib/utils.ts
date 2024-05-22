import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Making a utility function to convert the long timestamp into a small readible one.
export const getTimestamp = (createdAt: Date): string => {
  // Got from Chat Gpt

  /* Prompt -> Create a javascript function that looks like this: "export const getTimestamp = (createdAt : Date) : string => {
  
}" 

whose goal is to take a Date and convert it into a string In the format: (time) ago

eg. 2 days ago ; 5 minutes ago; 6 hours ago. Something like this. 

*/

  // const now = new Date();
  // const elapsedMilliseconds = now - createdAt;

  // Resolving the TypeScript Error via ChatGpt
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - createdAt.getTime();

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  // Calculate elapsed time in different units
  const elapsedYears = Math.floor(elapsedMilliseconds / year);
  const elapsedMonths = Math.floor(elapsedMilliseconds / month);
  const elapsedDays = Math.floor(elapsedMilliseconds / day);
  const elapsedHours = Math.floor(elapsedMilliseconds / hour);
  const elapsedMinutes = Math.floor(elapsedMilliseconds / minute);

  // Choose the appropriate time unit
  if (elapsedYears > 0) {
    return `${elapsedYears} year${elapsedYears > 1 ? "s" : ""} ago`;
  } else if (elapsedMonths > 0) {
    return `${elapsedMonths} month${elapsedMonths > 1 ? "s" : ""} ago`;
  } else if (elapsedDays > 0) {
    return `${elapsedDays} day${elapsedDays > 1 ? "s" : ""} ago`;
  } else if (elapsedHours > 0) {
    return `${elapsedHours} hour${elapsedHours > 1 ? "s" : ""} ago`;
  } else if (elapsedMinutes > 0) {
    return `${elapsedMinutes} minute${elapsedMinutes > 1 ? "s" : ""} ago`;
  } else {
    return `just now`;
  }
};

// Utility function for views, votes and answers in a readible format

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000000) {
    // Billions
    const billionValue = (num / 1000000000).toFixed(1);
    if (billionValue.endsWith(".0")) {
      return billionValue.slice(0, -2) + "B"; // Remove the decimal and ".0"
      // 🛑🛑 0 means start from the beginning and -2 means slice the last 2 digits of the number (here it is 0 and .)
    } else {
      return billionValue + "B";
    }
  } else if (num >= 1000000) {
    // Millions
    const millionValue = (num / 1000000).toFixed(1);
    if (millionValue.endsWith(".0")) {
      return millionValue.slice(0, -2) + "M"; // Remove the decimal and ".0"
    } else {
      return millionValue + "M";
    }
  } else if (num >= 1000) {
    // Thousands
    const thousandValue = (num / 1000).toFixed(1);
    if (thousandValue.endsWith(".0")) {
      return thousandValue.slice(0, -2) + "K"; // Remove the decimal and ".0"
    } else {
      return thousandValue + "K";
    }
  } else {
    return num.toString(); // Return as is
  }
};
