import { z } from 'zod';

export interface Geo {
  lat?: string;
  lng?: string;
}

export interface Address {
  street: string;
  suite?: string;
  city: string;
  zipcode: string;
  geo?: Geo;
}

export interface Company {
  name: string;
  catchPhrase?: string;
  bs?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website?: string;
  company: Company;
}

/**
 * Zod validation schema strictly following technical assessment specification:
 * - Personal:
 *    - name: Required, min 3 chars
 *    - username: Required, alphanumeric
 *    - email: Required, valid email format
 *    - phone: Required phone
 *    - website: Optional website URL
 * - Company:
 *    - company.name: Required company name
 *    - company.catchPhrase: Optional catchphrase
 *    - company.bs: Optional business strategy
 * - Address:
 *    - address.street: Required street
 *    - address.suite: Optional suite/apt
 *    - address.city: Required city
 *    - address.zipcode: Required zipcode
 * - Coordinates:
 *    - address.geo.lat: Optional geographic coordinate string input
 *    - address.geo.lng: Optional geographic coordinate string input
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Full name must be at least 3 characters long' })
    .max(100, { message: 'Full name cannot exceed 100 characters' }),
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message: 'Username must be alphanumeric (letters, numbers, _, ., -)',
    }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(1, { message: 'Phone number is required' }),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i.test(val.trim());
      },
      { message: 'Please enter a valid website URL or domain (e.g. example.com)' }
    ),
  company: z.object({
    name: z.string().min(1, { message: 'Company name is required' }),
    catchPhrase: z.string().optional(),
    bs: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(1, { message: 'Street address is required' }),
    suite: z.string().optional(),
    city: z.string().min(1, { message: 'City is required' }),
    zipcode: z.string().min(1, { message: 'Zipcode is required' }),
    geo: z
      .object({
        lat: z
          .string()
          .optional()
          .refine(
            (val) => {
              if (!val || val.trim() === '') return true;
              const n = parseFloat(val);
              return !isNaN(n) && n >= -90 && n <= 90;
            },
            { message: 'Latitude must be between -90 and 90' }
          ),
        lng: z
          .string()
          .optional()
          .refine(
            (val) => {
              if (!val || val.trim() === '') return true;
              const n = parseFloat(val);
              return !isNaN(n) && n >= -180 && n <= 180;
            },
            { message: 'Longitude must be between -180 and 180' }
          ),
      })
      .optional(),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
