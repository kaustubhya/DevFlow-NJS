import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";

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
  const timeDifference = now.getTime() - createdAt.getTime();

  // Define time intervals in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (timeDifference < minute) {
    const seconds = Math.floor(timeDifference / 1000);
    return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
  } else if (timeDifference < hour) {
    const minutes = Math.floor(timeDifference / minute);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (timeDifference < day) {
    const hours = Math.floor(timeDifference / hour);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (timeDifference < week) {
    const days = Math.floor(timeDifference / day);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (timeDifference < month) {
    const weeks = Math.floor(timeDifference / week);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (timeDifference < year) {
    const months = Math.floor(timeDifference / month);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(timeDifference / year);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
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

// export const formatAndDivideNumber = (num: number): string => {
//   if (num >= 1000000) {
//     const formattedNum = (num / 1000000).toFixed(1);
//     return `${formattedNum}M`;
//   } else if (num >= 1000) {
//     const formattedNum = (num / 1000).toFixed(1);
//     return `${formattedNum}K`;
//   } else {
//     return num.toString();
//   }
// };

// Write a TypeScript function that takes a JavaScript date object as a parameter and returns a joined date (just a month and a year)
export const getJoinedDate = (date: Date): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// Example usage:
// const date = new Date();
// console.log(getJoinedDate(date)); // Outputs something like "6-2024" if the current month is June and the year is 2024

// Debouncing function
interface URLQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: URLQueryParams) => {
  // get access to the current URL
  const currentUrl = qs.parse(params); // 🛑🛑 Used the query string package here

  currentUrl[key] = value;
  // extract the current url and update the new key as the value

  return qs.stringifyUrl(
    {
      // url: 'https://foo.bar',
      url: window.location.pathname, // get the base pathname
      query: currentUrl,
    },
    { skipNull: true }
    // second object for the options, we donot need any null values
  );
};
// 🛑 This function checks what all previous url contents we have and updates only the specific content in the url we want to update

interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: removeUrlQueryParams) => {
  // get access to the current URL
  const currentUrl = qs.parse(params); // 🛑🛑 Used the query string package here

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      // url: 'https://foo.bar',
      url: window.location.pathname, // get the base pathname
      query: currentUrl,
    },
    { skipNull: true }
    // second object for the options, we donot need any null values
  );
};

// go to local search bar.tsx

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const {type, count} = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if(count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    })
  })

  return badgeCounts;
};

// This function does the job of checking if the titles are meaningful or not. If input title is undefined or null, it returns 'No Job title'.
// It splits the title into words and filters out unwanted words (undefined, null, 'undefined', 'null')
// And it joins valid words to create the processed title

export function processJobTitle(title: string | undefined | null): string {
  // check if title is undefined or null
  
  if(title === undefined || title === null) {
    return 'No Job Title';
  }

  // Split the title into words
  const words = title.split(' ');

  // filter out undefined, null and other unwanted words
  const validWords = words.filter((word) => {
    return (
      word !== undefined && 
      word !== null &&
      word.toLowerCase() !== 'undefined' &&
      word.toLowerCase() !== 'null'
    );
  });

  // If no valid words left, return the general title
  if(validWords.length === 0) {
    return 'No Job Title';
  }

  // Join the valid words to create the processed title
  const processedTitle = validWords.join(' ');

  return processedTitle;

}
