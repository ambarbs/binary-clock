export const pad = (n: number) => n.toString().padStart(2, "0");

/** Split a 0–99 number into its two decimal digits (tens, units). */
export function splitDigits(num: number): [number, number] {
  const s = pad(num);
  return [Number(s[0]), Number(s[1])];
}
