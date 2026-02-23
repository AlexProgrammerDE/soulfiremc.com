import { EmailTemplate } from "@daveyplate/better-auth-ui/server";
import { sendEmail } from "@/lib/resend";

interface BaseEmailParams {
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
}

interface EmailWithUrlParams extends BaseEmailParams {
  url: string;
}

interface OTPEmailParams extends BaseEmailParams {
  otp: string;
}

interface EmailOTPParams {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

const siteName = "SoulFire";
const baseUrl = "https://soulfiremc.com";
const imageUrl = `${baseUrl}/apple-icon.png`;
const fromAddress = "SoulFire Auth <auth@transactional.soulfiremc.com>";
const replyTo = "SoulFire Support <support@transactional.soulfiremc.com>";

export const authNotifications = {
  async sendPasswordReset({ user, url }: EmailWithUrlParams) {
    const name = user.name ?? user.email.split("@")[0];
    await sendEmail(
      fromAddress,
      user.email,
      replyTo,
      `Your password reset request for ${siteName}`,
      EmailTemplate({
        action: "Reset Password",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to reset your password. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Password reset request",
        siteName,
        baseUrl,
        imageUrl,
        url,
      }),
    );
  },

  async sendEmailVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name ?? user.email.split("@")[0];
    await sendEmail(
      fromAddress,
      user.email,
      replyTo,
      `Verify your email address for ${siteName}`,
      EmailTemplate({
        action: "Verify Email",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>Click the button below to verify your email address.</p>
          </>
        ),
        heading: "Verify your email address",
        siteName,
        baseUrl,
        imageUrl,
        url,
      }),
    );
  },

  async sendChangeEmailVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name ?? user.email.split("@")[0];
    await sendEmail(
      fromAddress,
      user.email,
      replyTo,
      `Your email change verification for ${siteName}`,
      EmailTemplate({
        action: "Change Email",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to change your email. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Email change verification",
        siteName,
        baseUrl,
        imageUrl,
        url,
      }),
    );
  },

  async sendDeleteAccountVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name ?? user.email.split("@")[0];
    await sendEmail(
      fromAddress,
      user.email,
      replyTo,
      `Your account deletion request for ${siteName}`,
      EmailTemplate({
        action: "Delete Account",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to delete your account. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Account deletion request",
        siteName,
        baseUrl,
        imageUrl,
        url,
      }),
    );
  },

  async sendTwoFactorOTP({ user, otp }: OTPEmailParams) {
    const name = user.name ?? user.email.split("@")[0];
    await sendEmail(
      fromAddress,
      user.email,
      replyTo,
      `Your verification code for ${siteName}`,
      EmailTemplate({
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              Your verification code is <strong>{otp}</strong>.
            </p>
            <p>If you did not request this, please ignore this email.</p>
          </>
        ),
        heading: "Two-factor authentication code",
        siteName,
        baseUrl,
        imageUrl,
      }),
    );
  },

  async sendEmailOTP({ email, otp, type }: EmailOTPParams) {
    const headingMap = {
      "sign-in": "Sign in code",
      "email-verification": "Email verification code",
      "forget-password": "Password reset code",
    };
    const subjectMap = {
      "sign-in": `Your sign-in code for ${siteName}`,
      "email-verification": `Your verification code for ${siteName}`,
      "forget-password": `Your password reset code for ${siteName}`,
    };

    await sendEmail(
      fromAddress,
      email,
      replyTo,
      subjectMap[type],
      EmailTemplate({
        content: (
          <>
            <p>
              Your code is <strong>{otp}</strong>.
            </p>
            <p>If you did not request this, please ignore this email.</p>
          </>
        ),
        heading: headingMap[type],
        siteName,
        baseUrl,
        imageUrl,
      }),
    );
  },
};
