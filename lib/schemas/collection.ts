import * as yup from "yup";

export const NAME_MAX = 20;
export const IMAGE_URL_MAX = 100;
export const TOTAL_MAX = 1000;

export const createCollectionSchema = yup.object({
  name: yup
    .string()
    .required("Name is required.")
    .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters.`)
    .trim(),
  imageUrl: yup
    .string()
    .trim()
    .max(IMAGE_URL_MAX, `Image URL must be at most ${IMAGE_URL_MAX} characters.`)
    .default(""),
  total: yup
    .number()
    .required("Total is required and must be a number.")
    .integer("Total must be a whole number.")
    .min(1, `Total must be between 1 and ${TOTAL_MAX}.`)
    .max(TOTAL_MAX, `Total must be between 1 and ${TOTAL_MAX}.`)
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value,
    ),
});

export type CreateCollectionFormValues = yup.InferType<typeof createCollectionSchema>;

/** Form input type (total can be string from number input before submit) */
export type CreateCollectionFormInput = Omit<CreateCollectionFormValues, "total"> & {
  total: string | number;
};
