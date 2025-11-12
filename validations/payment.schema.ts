import * as Yup from "yup";

export const paymentValidationSchema = Yup.object({
  amount: Yup.number()
    .typeError("Amount must be a valid number")
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  recipientName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Recipient name is required"),
  recipientAccount: Yup.string()
    .matches(/^ACC-\d+$/, "Account must start with ACC- followed by digits")
    .required("Recipient account is required"),
  currency: Yup.string().required("Currency is required"),
});
