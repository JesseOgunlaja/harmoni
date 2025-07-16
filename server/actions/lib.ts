import { createTransport } from "nodemailer";
import { ComponentProps, JSX } from "react";
import { env } from "../env";

export const transporter = createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

export async function sendEmail<
  T extends (_props: ComponentProps<T>) => JSX.Element
>(to: string, subject: string, component: T, props: ComponentProps<T>) {
  const { renderToStaticMarkup } = (await import("react-dom/server")).default;
  const mailOptions = {
    from: "Harmoni <noreply@harmoni.jesseogu.dev>",
    to,
    subject,
    html: renderToStaticMarkup(component(props)),
  };

  await transporter.sendMail(mailOptions);
}
