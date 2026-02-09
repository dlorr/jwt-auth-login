import resend from "../config/resend.config";
import { APP_ENV, EMAIL_SENDER } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  text: string;
  html: string;
};
const getFromEmail = () => {
  return APP_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;
};
const getToEmail = (to: string) => {
  return APP_ENV === "development" ? "delivered@resend.dev" : to;
};
export const sendEmail = async ({ to, subject, text, html }: Params) => {
  return resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
};
