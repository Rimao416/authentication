import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
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
