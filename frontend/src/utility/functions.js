import toast from "react-hot-toast";
import Long from "long";

export function formatDateTime(dateString: string): string {
  if (!dateString) return ""; // Return empty string if dateString is falsy

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return ""; // Handle invalid dates

  // Format date as M/D/YYYY in UTC
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC", // Ensure the date is in UTC
  });

  // Format time as HH:MM in UTC (24-hour format)
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC", // Ensure the time is in UTC
  });

  // Combine date and time with proper UTC notation
  return `${formattedDate}, ${formattedTime} (UTC)`;
}

export function timeStamptimeAgo(unixTimestamp) {
  const seconds = Math.floor((Date.now() - unixTimestamp * 1000) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval}${unit.charAt(0)} ago`;
    }
  }

  return "just now";
}

function removeTrailingZeros(value, decimals = 18) {
  // Use toFixed to limit the number of decimals
  let fixed = value.toFixed(decimals);
  // Remove trailing zeros and optional dot if no decimals remain
  return fixed.replace(/\.?0+$/, "");
}

export function formatBigInt(bigIntValue) {
  console.log("bigIntValue:", bigIntValue);

  // Check if it's a Long instance or Long-like object
  try {
    if (
      Long.isLong(bigIntValue) ||
      (bigIntValue && "low" in bigIntValue && "high" in bigIntValue)
    ) {
      const longValue = Long.isLong(bigIntValue)
        ? bigIntValue // Already a Long instance
        : Long.fromBits(
            bigIntValue.low,
            bigIntValue.high,
            bigIntValue.unsigned
          ); // Convert to Long instance

      console.log("Is Long");
      const divisor = 1000000000000000000n;
      const result = Number(longValue.toNumber()) / Number(divisor);
      return removeTrailingZeros(result);
    }
  } catch (error) {}

  const divisor = 1000000000000000000n;
  const result = Number(bigIntValue) / Number(divisor);
  return removeTrailingZeros(result);

  // Fallback for other types
  return String(bigIntValue);
}

export function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds

  // Format individual components
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. "Sep"
  const day = date.getDate(); // e.g. 29
  const year = date.getFullYear(); // e.g. 2024
  const hours = date.getHours(); // e.g. 13
  const minutes = date.getMinutes().toString().padStart(2, "0"); // e.g. 16
  const seconds = date.getSeconds().toString().padStart(2, "0"); // e.g. 23
  const period = hours >= 12 ? "PM" : "AM"; // Determine AM/PM

  // Get the timezone offset in minutes and format it
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const sign = timezoneOffsetMinutes > 0 ? "-" : "+";
  const offsetHours = Math.abs(Math.floor(timezoneOffsetMinutes / 60))
    .toString()
    .padStart(2, "0");
  const offsetMinutes = Math.abs(timezoneOffsetMinutes % 60)
    .toString()
    .padStart(2, "0");

  // Construct timezone in UTC offset format (e.g. +03:30 UTC)
  const utcOffset = `${sign}${offsetHours}:${offsetMinutes} UTC`;

  // Combine everything into the final string
  return `${month} ${day} ${year} ${hours}:${minutes}:${seconds} ${period} (${utcOffset})`;
}

export function copyText(copy, message) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(String(copy))
      .then(() => {
        toast.success(`${message} copied successfully`, {
          style: { background: "#1E1F21", color: "white" },
        });
      })
      .catch((err) => {
        toast.error("Failed to copy", {
          style: { background: "#1E1F21", color: "white" },
        });
        console.error("Failed to copy text: ", err);
      });
  } else {
    toast.error("Clipboard API not supported", {
      style: { background: "#1E1F21", color: "white" },
    });
  }
}
