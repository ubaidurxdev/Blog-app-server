import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_NAME,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: `"Blog App" <${process.env.APP_NAME}>`,
          to: user.email,
          subject: "Verify your email address",
          text: `
Hello ${user.name ?? "there"},

Thanks for signing up for Blog App.

Please verify your email address by clicking the link below:
${verificationUrl}

If you did not create an account, you can safely ignore this email.

— Blog App Team
      `,
          html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2>Verify your email address</h2>

  <p>Hello ${user.name ?? "there"},</p>

  <p>
    Thanks for signing up for <strong>Blog App</strong>.
    Please confirm your email address by clicking the button below.
  </p>

  <p style="margin: 30px 0;">
    <a
      href="${verificationUrl}"
      style="
        background-color: #2563eb;
        color: #ffffff;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      "
    >
      Verify Email
    </a>
  </p>

  <p>
    If the button doesn’t work, copy and paste this link into your browser:
  </p>

  <p style="word-break: break-all;">
    <a href="${verificationUrl}">${verificationUrl}</a>
  </p>

  <p>
    If you didn’t create an account, you can safely ignore this email.
  </p>

  <p style="margin-top: 40px;">
    — <br />
    <strong>Blog App Team</strong>
  </p>
</div>
      `,
        });

        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
