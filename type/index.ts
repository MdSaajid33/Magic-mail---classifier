import { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  image: string
}

export interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  date: string
  category?: EmailCategory
}

export type EmailCategory = 
  | 'important' 
  | 'promotions' 
  | 'social' 
  | 'marketing' 
  | 'spam' 
  | 'general'

export interface ClassificationResult {
  emailId: string
  category: EmailCategory
  confidence: number
}