export default function convertMinutesToHour(timeInMinutes: number) {
  const hour = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
