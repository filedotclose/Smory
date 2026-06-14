"use server";

import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  
  let authOptions: any = { password };
  
  // Basic phone number check (can be improved)
  if (/^\+?[1-9]\d{1,14}$/.test(emailOrPhone)) {
    authOptions.phone = emailOrPhone;
  } else {
    authOptions.email = emailOrPhone;
  }

  const { error } = await supabase.auth.signInWithPassword(authOptions);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signup(formData: FormData) {
  const emailOrPhone = formData.get("emailOrPhone") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  let authOptions: any = { password };
  const isPhone = /^\+?[1-9]\d{1,14}$/.test(emailOrPhone);
  
  if (isPhone) {
    authOptions.phone = emailOrPhone;
  } else {
    authOptions.email = emailOrPhone;
  }

  const { data, error } = await supabase.auth.signUp(authOptions);

  if (error) {
    return { error: error.message };
  }

  // We don't create profile yet, we wait for OTP verification.
  return { success: true, requireOtp: true, type: isPhone ? 'phone' : 'email', identifier: emailOrPhone };
}

export async function verifyOTP(formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const token = formData.get("token") as string;
  const type = formData.get("type") as 'phone' | 'email';

  const supabase = await createClient();

  const verifyType = type === 'phone' ? 'sms' : 'signup';
  
  const verifyOptions: any = {
    token,
    type: verifyType,
  };

  if (type === 'phone') verifyOptions.phone = identifier;
  else verifyOptions.email = identifier;

  const { data, error } = await supabase.auth.verifyOtp(verifyOptions);

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
