export function formatDate(dateString: string): string {
  if (dateString.length !== 8) {
    throw new Error('Invalid date format. Expected format: YYYYMMDD');
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  // "2024년 8월 2일 금요일" 형식을 Date 객체로 변환
  const [year, month, day] = dateString
    .replace('년', '')
    .replace('월', '')
    .replace('일', '')
    .split(' ')
    .map((part) => parseInt(part.trim()));

  const date = new Date(year, month - 1, day);

  return date;
}
