import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure profile exists for the newly logged-in user via link
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
          console.error("Failed to create profile in callback:", err);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Redirect to welcome or login if code is invalid or missing
  return NextResponse.redirect(`${origin}/welcome`);
}
