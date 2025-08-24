/** Convert number `n` into a big-endian bit array of fixed `size`. */
export function toBits(n: number, size: number): number[] {
  const bits = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    bits[size - 1 - i] = (n >> i) & 1;
  }
  return bits;
}
