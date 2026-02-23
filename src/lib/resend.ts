import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  from: string,
  to: string,
  replyTo: string,
  subject: string,
  react: React.ReactElement,
): Promise<void> {
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    react,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
