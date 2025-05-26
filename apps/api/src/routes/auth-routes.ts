import { type FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { user, type NewUser, type UserWithoutPassword } from "../../db/schema";
import {
  registerSchema,
  loginSchema,
  type RegisterRequest,
  type LoginRequest,
} from "./lib/auth.schemas";
import { validateBody } from "../middleware/validation-middleware";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterRequest }>(
    "/v1/auth/register",
    { preHandler: validateBody(registerSchema) },
    async (request, reply) => {
      const { email, password, fullName } = request.body;

      try {
        // Check if user already exists
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1);

        if (existingUser.length > 0) {
          return reply.status(409).send({
            error: "User already exists with this email",
          });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser: NewUser = {
          email,
          password: hashedPassword,
          fullName,
        };

        const [createdUser] = await db.insert(user).values(newUser).returning({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });

        return reply.status(201).send({
          message: "User registered successfully",
          user: createdUser,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: "Internal server error",
        });
      }
    }
  );

  // Login route
  fastify.post<{ Body: LoginRequest }>(
    "/v1/auth/login",
    {
      preHandler: validateBody(loginSchema),
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        // Find user by email
        const [foundUser] = await db
          .select()
          .from(user)
          .where(eq(user.email, email))
          .limit(1);

        if (!foundUser) {
          return reply.status(401).send({
            error: "Invalid email or password",
          });
        }

        // Check if user is active
        if (!foundUser.isActive) {
          return reply.status(401).send({
            error: "Account is deactivated",
          });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          password,
          foundUser.password
        );

        if (!isValidPassword) {
          return reply.status(401).send({
            error: "Invalid email or password",
          });
        }

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            id: foundUser.id,
            email: foundUser.email,
          },
          { expiresIn: "24h" }
        );

        // Return user data without password
        const userWithoutPassword: UserWithoutPassword = {
          id: foundUser.id,
          email: foundUser.email,
          fullName: foundUser.fullName,
          isActive: foundUser.isActive,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
        };

        return reply.send({
          message: "Login successful",
          user: userWithoutPassword,
          token,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          error: "Internal server error",
        });
      }
    }
  );

  // Get current user profile (protected route)
  fastify.get("/v1/auth/me", async (request, reply) => {
    try {
      console.log("request.user", request.user);
      await request.jwtVerify();

      const foundUser = await db.query.user.findFirst({
        where: eq(user.id, request.user.id),
        columns: {
          id: true,
          email: true,
          fullName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!foundUser) {
        return reply.status(404).send({
          error: "User not found",
        });
      }

      return reply.send({
        user: foundUser,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        error: "Internal server error",
      });
    }
  });
}
