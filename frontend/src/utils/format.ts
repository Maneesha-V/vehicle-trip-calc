export const formatDuration = (sec: number): string => {
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}Hr ${m} Mins`;
  if (m > 0) return `${m} Mins`;
  return `${s} Secs`;
};

export const formatDistance = (meters: number): string =>
  meters >= 1000 ? `${Number((meters / 1000).toFixed(1))} KM` : `${Math.round(meters)} M`;

// CSV timestamps have no timezone and the backend stores them as UTC,
// so show them in UTC to match the file exactly.
export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: "UTC", hour12: true });

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", { timeZone: "UTC" });

export const formatPoint = (lat: number, lng: number): string =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;