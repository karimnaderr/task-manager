import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/validation";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register({ firstName, lastName, email, password }: RegisterInput) {
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists.");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });

    return {
      user: { id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email },
      token,
    };
  },

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password.");

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

    return {
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      token,
    };
  },

  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    if (!user) throw new Error("User not found.");

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    };
  },
};
