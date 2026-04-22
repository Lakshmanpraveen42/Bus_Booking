import { format, parseISO } from 'date-fns';

/**
 * Format price in INR with ₹ symbol and comma separators.
 */
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

/**
 * Convert total minutes to human-readable duration, e.g. "8h 30m".
 */
export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Format a date string (YYYY-MM-DD) to display format, e.g. "Mon, 22 Apr 2026".
 */
export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'EEE, dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

/**
 * Format a date string to short format, e.g. "22 Apr".
 */
export const formatDateShort = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'dd MMM');
  } catch {
    return dateStr;
  }
};

/**
 * Format a 24h time string (HH:mm) to 12h format with AM/PM, e.g. "10:30 PM".
 */
export const formatTime12h = (dateStr) => {
  if (!dateStr) return '--:-- --';
  try {
    // If it's a full ISO string (contains T or space), extract the time part
    let timePart = dateStr;
    if (dateStr.includes('T')) timePart = dateStr.split('T')[1];
    else if (dateStr.includes(' ')) timePart = dateStr.split(' ')[1];
    
    // Ensure we only have HH:mm
    const [hour, min] = timePart.substring(0, 5).split(':').map(Number);
    if (isNaN(hour) || isNaN(min)) return '--:-- --';

    const period = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
  } catch (err) {
    return '--:-- --';
  }
};

/**
 * Parse "HH:mm" time string into total minutes from midnight.
 */
export const timeToMinutes = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Truncate a string to maxLen characters, appending '...' if truncated.
 */
export const truncate = (str, maxLen = 40) =>
  str.length > maxLen ? `${str.substring(0, maxLen)}...` : str;

/**
 * Format a number with comma separators, e.g. 1284 → "1,284".
 */
export const formatCount = (n) => new Intl.NumberFormat('en-IN').format(n);

/**
 * Return seat count label, e.g. "14 seats left" or "FULL".
 */
export const formatSeatsLeft = (count) => {
  if (count === 0) return 'FULL';
  if (count <= 5) return `Only ${count} left!`;
  return `${count} seats available`;
};
