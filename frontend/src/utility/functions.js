import toast from "react-hot-toast";

export function formatDateTime(isoString) {
	const date = new Date(isoString);

	// Extract date in 'YYYY-MM-DD' format
	const formattedDate = date.toISOString().split("T")[0];

	// Extract time in 'HH:MM:SS' format
	const formattedTime = date.toTimeString().split(" ")[0];

	return `${formattedDate}, ${formattedTime}`;
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

export function formatBigInt(bigIntValue) {
	if (bigIntValue === 0n) {
		return 0;
	}
	const divisor = 1000000000000000000n;
	const result = Number(bigIntValue) / Number(divisor);
	return Number(result.toFixed(5));
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
