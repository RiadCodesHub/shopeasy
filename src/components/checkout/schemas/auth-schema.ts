import { CgPassword } from 'react-icons/cg';
import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
});

 export const loginSchema = z.object({
    email:z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required")
 });

 export type RegisterData = z.infer<typeof registerSchema>;
 export type LoginData = z.infer<typeof loginSchema>;