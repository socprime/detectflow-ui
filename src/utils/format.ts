export type DateFormat = 'date' | 'time' | 'datetime' | 'full' | 'short';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const parseDate = (date: string | Date | number): Date | null => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch {
    return null;
  }
};

export const formatDate = (
  date: string | Date | number,
  format: DateFormat = 'datetime',
): string => {
  const dateObj = parseDate(date);

  if (!dateObj) {
    console.warn(`Invalid date: ${date}`);
    return typeof date === 'string' ? date : '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'time':
      return `${hours}:${minutes}`;
    case 'full':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    case 'short': {
      const monthName = monthNames[dateObj.getMonth()];
      const dayNum = dateObj.getDate();
      let hours12 = dateObj.getHours();
      const ampm = hours12 >= 12 ? 'PM' : 'AM';
      hours12 = hours12 % 12;
      hours12 = hours12 ? hours12 : 12;
      const minutesStr = String(dateObj.getMinutes()).padStart(2, '0');
      return `${monthName} ${dayNum}, ${hours12}:${minutesStr} ${ampm}`;
    }
    case 'datetime':
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
};

export const formatDateRelative = (date: string | Date | number): string => {
  const dateObj = parseDate(date);

  if (!dateObj) {
    return typeof date === 'string' ? date : '';
  }

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatDate(date, 'date');
};

export const isValidDate = (date: string | Date | number): boolean => {
  return parseDate(date) !== null;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const truncate = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};
