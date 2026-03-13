import * as yup from "yup";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> };

export function validateFormSchema<T extends yup.Schema>(
  schema: T,
  raw: unknown,
): ValidationResult<yup.InferType<T>> {
  try {
    const data = schema.validateSync(raw, {
      abortEarly: false,
    }) as yup.InferType<T>;
    return { ok: true, data };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      for (const e of err.inner) {
        if (e.path) {
          errors[e.path] = e.message;
        }
      }
      return { ok: false, errors };
    }
    throw err;
  }
}
