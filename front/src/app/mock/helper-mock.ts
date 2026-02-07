export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function frDate(day: number, month: number, year = 2026): string {
  return `${pad2(day)}/${pad2(month)}/${year}`;
}

export function isoDate(day: number, month: number, year = 2026): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function timeSlot(i: number): string {
  const slots = ['08:30','09:00','09:15','10:00','10:30','11:00','14:00','14:30','15:00','16:00'];
  return slots[i % slots.length];
}