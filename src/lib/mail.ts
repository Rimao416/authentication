import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTwoFactorTokenEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  await resend.emails.send({
    from: "onbarding@resend.dev",
    to: email,
    subject: "2-Factor Authentication",
    html: `<p>Your 2FA Code is ${token}</p>`,
  });
};

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "onbarding@resend.dev",
    to: email,
    subject: "Please confirm your email address",
    html: `<p>Click the following link to confirm your email address</p>
        <a href="${confirmLink}">${confirmLink}</a>`,
  });
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onbarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click the following link to reset your password</p>
        <a href="${resetLink}">${resetLink}</a>`,
  });
};
