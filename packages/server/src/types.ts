import type { Request } from "express"

type AuthRequestHeaders = Headers & {authorization: string}

export type AuthRequest = Request & {
  headers: AuthRequestHeaders
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  }
}