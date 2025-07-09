import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem('token', token);
  }
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem("token");
  }
  return null;
}

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("token");
  }
}
