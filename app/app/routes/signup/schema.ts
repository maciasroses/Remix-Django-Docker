import z from "zod";

export const validateUsername = z.string().min(2);
export const validateEmail = z.string().email();
export const validatePassword = z.string().min(8);
