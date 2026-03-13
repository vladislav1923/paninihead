import * as yup from "yup";
import { commaSeparatedNumbers, parseCommaSeparatedNumbers } from "@/lib/schemas/exchanger";

export const dealFormSchema = yup.object({
  in: commaSeparatedNumbers,
  out: commaSeparatedNumbers,
});

export type DealFormValues = yup.InferType<typeof dealFormSchema>;

export { parseCommaSeparatedNumbers };
