import * as yup from "yup";
import { collected } from "@/lib/schemas/exchanger";

export const dealFormSchema = yup.object({
  in: collected,
  out: collected,
});

export type DealFormValues = yup.InferType<typeof dealFormSchema>;
