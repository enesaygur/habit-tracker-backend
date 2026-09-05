export function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates
    .map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort((a, b) => b - a);

  let streak = 1;
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i] - sortedDates[i + 1];
    if (diff === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mostRecentLog = sortedDates[0];
  const daysSinceLastLog = (today.getTime() - mostRecentLog) / oneDayMs;

  if (daysSinceLastLog > 1) {
    return 0;
  }

  return streak;
}