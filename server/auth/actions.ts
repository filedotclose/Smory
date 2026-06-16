"use server";

import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://smory-sigma.vercel.app');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`
    }
  });

  if (error) {
    return { error: error.message };
  }

  // We don't create profile yet, we wait for OTP verification.
  return { success: true, requireOtp: true, type: 'email', identifier: email };
}

export async function verifyOTP(formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const token = formData.get("token") as string;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email: identifier,
    token,
    type: 'signup',
  });

  if (error) {
    return { error: error.message };
  }

  // OTP verified, user is logged in. Now create the profile if it doesn't exist.
  if (data.user) {
    const existingUser = await prisma.user.findUnique({ where: { id: data.user.id } });
    
    if (!existingUser) {
      const speciesList = ['Fox', 'Wolf', 'Cat', 'Dragon', 'Owl', 'Rabbit'];
      const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
      const randomAlias = `Smoker${Math.floor(Math.random() * 100000)}`;

      try {
        await prisma.user.create({
          data: {
            id: data.user.id,
            anonymous_username: randomAlias,
            avatar_species: randomSpecies,
          }
        });
      } catch (err) {
        console.error("Failed to create profile:", err);
      }
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { id: user.id } });
}
