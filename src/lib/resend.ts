import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendEmail(
  from: string,
  to: string,
  replyTo: string,
  subject: string,
  react: React.ReactElement,
): Promise<void> {
  const { error } = await getResend().emails.send({
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
