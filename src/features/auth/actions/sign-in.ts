'use server';

import {
  FormState,
  fromErrorToFormState,
} from '@/components/form/utils/to-form-state';
import { lucia } from '@/lib/lucia';
import { prisma } from '@/lib/prisma';
import { ticketsPath } from '@/paths';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { z } from 'zod';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Is required' })
    .max(191)
    .email(),
  password: z.string().min(6).max(191),
});

export const signIn = async (
  _formState: FormState,
  formData: FormData
) => {
  try {
    const { email, password } = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        status: 'ERROR' as const,
        fieldErrors: {},
        message: 'Incorrect email or password',
        timestamp: Date.now(),
      };
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password
    );

    if (!validPassword) {
      return {
        status: 'ERROR' as const,
        fieldErrors: {},
        message: 'Incorrect email or password',
        timestamp: Date.now(),
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    return fromErrorToFormState(error);
  }

  redirect(ticketsPath());
};