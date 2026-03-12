import * as yup from "yup";

const NAME_MAX = 50;
const LINK_MAX = 300;

const commaSeparatedNumbers = yup
  .string()
  .trim()
  .optional()
  .default("")
  .test(
    "comma-separated-numbers",
    "Must be a comma-separated list of numbers (e.g. 1, 2, 3)",
    (value) => {
      if (value === undefined || value === null || value === "") return true;
      const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
      return parts.every((p) => /^-?\d+$/.test(p));
    }
  );

export const addExchangerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters.`)
    .trim(),
  link: yup
    .string()
    .required("Link is required.")
    .max(LINK_MAX, `Link must be at most ${LINK_MAX} characters.`)
    .trim(),
  has: commaSeparatedNumbers,
  needs: commaSeparatedNumbers,
});

export type AddExchangerFormValues = yup.InferType<typeof addExchangerSchema>;

export function parseCommaSeparatedNumbers(value: string): number[] {
  if (!value || !value.trim()) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseInt(s, 10))
    .filter((n) => !Number.isNaN(n));
}
