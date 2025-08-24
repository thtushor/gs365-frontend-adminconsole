/**
 * Formats a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use ('default', 'short', 'long', 'time-only')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'default') => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    default: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    long: {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    },
    'time-only': {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }
  };
  
  // Use en-GB locale to ensure DD/MM/YYYY format
  return dateObj.toLocaleString('en-GB', options[format] || options.default);
};

/**
 * Formats a date to DD/MM/YYYY HH:MM AM/PM format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'default');
};

/**
 * Formats a date to DD/MM/YYYY format only
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (date) => {
  return formatDate(date, 'short');
};

/**
 * Formats a date to show only time HH:MM AM/PM
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatTimeOnly = (date) => {
  return formatDate(date, 'time-only');
};

/**
 * Gets relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};
