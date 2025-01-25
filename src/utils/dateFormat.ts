export function formatApproximateTime(timestamp: number) {
	const date = new Date(timestamp);
	const dateStr = date.toLocaleString("en-US", {
		timeZone: "Asia/Kolkata",
		dateStyle: "medium",
	});

	const minutes = date.getMinutes();
	const roundedMinutes = Math.round(minutes / 15) * 15;
	date.setMinutes(roundedMinutes);

	const timeStr = date.toLocaleString("en-US", {
		timeZone: "Asia/Kolkata",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

	return `${dateStr} ~${timeStr}`;
}
