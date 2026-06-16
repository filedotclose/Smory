import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Initialize Supabase Admin Client using Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Seeding database...')

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars. Make sure .env is loaded.");
  }

  // Wipe database
  await prisma.log.deleteMany();
  await prisma.post.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database wiped");

  // 1. Create Users
  const usersData = [
    { email: 'fox@smory.app', password: 'Password123!', anonymous_username: 'AshFox21', avatar_species: 'Fox' },
    { email: 'owl@smory.app', password: 'Password123!', anonymous_username: 'NightOwl99', avatar_species: 'Owl' },
    { email: 'dragon@smory.app', password: 'Password123!', anonymous_username: 'VapeLord12', avatar_species: 'Dragon' },
    { email: 'cat@smory.app', password: 'Password123!', anonymous_username: 'StressedOut', avatar_species: 'Cat' },
    { email: 'wolf@smory.app', password: 'Password123!', anonymous_username: 'Quitter99', avatar_species: 'Wolf' },
  ]

  const users = []
  
  for (const data of usersData) {
    // Try to create auth user
    let authUser;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm so we can login immediately
    });

    if (authError) {
      if ((authError as any).code === 'email_exists' || authError.message.includes('registered')) {
        // If already exists, fetch the user ID
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        authUser = existingUsers.users.find(u => u.email === data.email);
      } else {
        console.error("Failed to create user", data.email, authError);
        continue;
      }
    } else {
      authUser = authData.user;
    }

    if (authUser) {
      // Upsert into Prisma using the real Auth ID
      const dbUser = await prisma.user.upsert({
        where: { id: authUser.id },
        update: {
          anonymous_username: data.anonymous_username,
          avatar_species: data.avatar_species,
        },
        create: {
          id: authUser.id,
          anonymous_username: data.anonymous_username,
          avatar_species: data.avatar_species,
        },
      });
      users.push(dbUser);
    }
  }

  console.log(`Created ${users.length} users in Supabase Auth & Prisma`)

  // 2. Create Communities
  const communitiesData = [
    { name: 'College Night Owls', description: 'For those 3 AM study breaks' },
    { name: 'The Break Room', description: 'Corporate stress relief' },
    { name: 'Quitting Squad', description: 'Supporting each other to stop' },
  ]

  const communities = await Promise.all(
    communitiesData.map((data) =>
      prisma.community.upsert({
        where: { name: data.name },
        update: {},
        create: data,
      })
    )
  )

  console.log(`Created ${communities.length} communities`)

  // 3. Add members to communities
  for (const user of users) {
    for (const community of communities) {
      // randomly join communities
      if (Math.random() > 0.4) {
        await prisma.communityMember.upsert({
          where: {
            userId_communityId: {
              userId: user.id,
              communityId: community.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            communityId: community.id,
          },
        })
      }
    }
  }

  // 4. Create Posts
  const postContents = [
    "Just unlocked the 'Stress Smoker' personality card. Pretty accurate honestly, only ever crave one during finals week 😅",
    "Does anyone else feel like the 10 minute smoke break is the only actual break you get at work?",
    "Day 3 of no smoking. The cravings are insane but looking at my health stats on the profile keeps me going.",
    "Switched to a lighter brand. Small steps.",
    "Why does coffee + cigarette hit so different? ☕️🚬",
    "Logging my habits made me realize I only smoke when I talk to my boss. Talk about a trigger lol.",
    "Does the PixiJS smoke animation on the feed look crazy to anyone else or is it just me?",
    "Lost my vape again. This is the 3rd time this month.",
    "Trying to cut down from 10 a day to 5. Wish me luck.",
    "The Wrapped report told me I smoke mostly at 11 PM. Might need to fix my sleep schedule.",
  ]

  for (let i = 0; i < 15; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)]
    const randomContent = postContents[Math.floor(Math.random() * postContents.length)]

    await prisma.post.create({
      data: {
        authorId: randomUser.id,
        content: randomContent,
      },
    })
  }

  console.log('Created posts')

  // 5. Create Logs
  const triggers = ['Stress', 'Social', 'Boredom', 'After Meal', 'Waking Up']
  const brands = ['Marlboro', 'Camel', 'American Spirit', 'Elf Bar', 'Juul']

  for (const user of users) {
    for (let i = 0; i < 10; i++) {
      await prisma.log.create({
        data: {
          userId: user.id,
          brand: brands[Math.floor(Math.random() * brands.length)],
          trigger: triggers[Math.floor(Math.random() * triggers.length)],
          note: Math.random() > 0.7 ? "Just another rough day" : null,
          timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7), // within last 7 days
        },
      })
    }
  }

  console.log('Created logs')
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
