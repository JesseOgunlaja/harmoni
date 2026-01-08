import { createTransport } from "nodemailer";
import { ComponentProps, JSX } from "react";
import { createServerStream } from "streamthing";
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

export async function createWebsocketStream() {
    return await createServerStream({
        id: env.NEXT_PUBLIC_WEBSOCKET_SERVER_ID,
        region: env.NEXT_PUBLIC_WEBSOCKET_SERVER_REGION,
        password: env.WEBSOCKET_SERVER_PASSWORD,
    });
}
