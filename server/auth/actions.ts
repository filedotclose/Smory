"use server";

import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const deviceId = crypto.randomUUID();
    try {
      await prisma.user.update({
        where: { id: data.user.id },
        data: { current_device_id: deviceId }
      });
      const cookieStore = await cookies();
      cookieStore.set("smory_device_id", deviceId, { httpOnly: true, secure: true, sameSite: 'lax' });
    } catch (err) {
      console.error("Failed to set device ID during login", err);
    }
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

  // If email confirmation is disabled in Supabase, a session is returned immediately.
  if (data.session) {
    const existingUser = await prisma.user.findUnique({ where: { id: data.user!.id } });
    
    if (!existingUser) {
      const speciesList = ['Fox', 'Wolf', 'Cat', 'Dragon', 'Owl', 'Rabbit'];
      const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
      const randomAlias = `Smoker${Math.floor(Math.random() * 100000)}`;

      try {
        await prisma.user.create({
          data: {
            id: data.user!.id,
            anonymous_username: randomAlias,
            avatar_species: randomSpecies,
          }
        });
      } catch (err) {
        console.error("Failed to create profile:", err);
      }
    }

    const deviceId = crypto.randomUUID();
    try {
      await prisma.user.update({
        where: { id: data.user!.id },
        data: { current_device_id: deviceId }
      });
      const cookieStore = await cookies();
      cookieStore.set("smory_device_id", deviceId, { httpOnly: true, secure: true, sameSite: 'lax' });
    } catch (err) {
      console.error("Failed to set device ID during auto-login", err);
    }
    
    revalidatePath("/", "layout");
    return { success: true, requireOtp: false };
  }

  // Otherwise, we wait for email verification.
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

    const deviceId = crypto.randomUUID();
    try {
      await prisma.user.update({
        where: { id: data.user.id },
        data: { current_device_id: deviceId }
      });
      const cookieStore = await cookies();
      cookieStore.set("smory_device_id", deviceId, { httpOnly: true, secure: true, sameSite: 'lax' });
    } catch (err) {
      console.error("Failed to set device ID during OTP verification", err);
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  const cookieStore = await cookies();
  cookieStore.delete("smory_device_id");
  
  redirect("/auth");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  let dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  // Failsafe: If the database was wiped but the user still has an active browser session,
  // we auto-create a fresh profile for them so the app doesn't break.
  if (!dbUser) {
    const speciesList = ['Fox', 'Wolf', 'Cat', 'Dragon', 'Owl', 'Rabbit'];
    const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
    const randomAlias = `Smoker${Math.floor(Math.random() * 100000)}`;

    try {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          anonymous_username: randomAlias,
          avatar_species: randomSpecies,
        }
      });
    } catch (err) {
      console.error("Failed to auto-create profile during getCurrentUser:", err);
      // If creation fails, we must force logout so they aren't trapped in a ghost state
      await supabase.auth.signOut();
      return null;
    }
  }

  // Session Concurrency Check
  const cookieStore = await cookies();
  const currentCookieId = cookieStore.get("smory_device_id")?.value;

  if (dbUser.current_device_id && dbUser.current_device_id !== currentCookieId) {
    console.log("Session mismatch detected. Logging out.");
    await supabase.auth.signOut();
    cookieStore.delete("smory_device_id");
    redirect("/auth");
  }

  // Track/Update daily login active streak
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (dbUser.last_login_date !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    
    let newStreak = 1;
    if (dbUser.last_login_date === yesterdayStr) {
      newStreak = dbUser.login_streak + 1;
    }
    
    try {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          last_login_date: todayStr,
          login_streak: newStreak
        }
      });
    } catch (err) {
      console.error("Failed to update user login streak:", err);
    }
  }

  return dbUser;
}
