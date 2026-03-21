import * as yup from "yup";
import { validateFormSchema } from "./validation";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  age: yup.number().required("Age is required").min(0, "Must be non-negative"),
});

describe("validateFormSchema", () => {
  it("returns ok with parsed data when valid", () => {
    const raw = { name: "Ada", age: 42 };
    const result = validateFormSchema(schema, raw);
    expect(result).toEqual({ ok: true, data: { name: "Ada", age: 42 } });
  });

  it("returns ok false with field errors when invalid", () => {
    const result = validateFormSchema(schema, {});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBeDefined();
      expect(result.errors.age).toBeDefined();
    }
  });

  it("collects multiple errors with abortEarly false", () => {
    const result = validateFormSchema(schema, { name: "", age: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("rethrows non-ValidationError from validateSync", () => {
    const badSchema = {
      validateSync: () => {
        throw new Error("sync failed");
      },
    } as unknown as yup.ObjectSchema<{ x: string }>;

    expect(() => validateFormSchema(badSchema, {})).toThrow("sync failed");
  });
});
