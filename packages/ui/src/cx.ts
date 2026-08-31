// Простое склеивание классов для атомов UI (принимает и массивы классов)
export function cx(...classes: Array<string | string[] | false | null | undefined>) {
  return classes.flat().filter(Boolean).join(" ");
}
