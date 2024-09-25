export function formatDateTime(isoString) {
	const date = new Date(isoString);

	// Extract date in 'YYYY-MM-DD' format
	const formattedDate = date.toISOString().split("T")[0];

	// Extract time in 'HH:MM:SS' format
	const formattedTime = date.toTimeString().split(" ")[0];

	return `${formattedDate}, ${formattedTime}`;
}
