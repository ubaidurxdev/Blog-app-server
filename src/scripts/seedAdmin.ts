import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/authentication";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: process.env.ADMIN_PASSWORD,
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!!");
    }
    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
  } catch (error) {
    console.error(error);
  }
}
