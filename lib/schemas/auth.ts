import * as yup from "yup";

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const authSchema = yup.object({
  username: yup
    .string()
    .required("Username is required.")
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters.`)
    .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters.`)
    .trim(),
  password: yup
    .string()
    .required("Password is required.")
    .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters.`)
    .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters.`),
});

export type AuthFormValues = yup.InferType<typeof authSchema>;
