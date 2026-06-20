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

  // 1. Wipe database (except communities)
  await prisma.log.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.puff.deleteMany();
  await prisma.insightReaction.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.insight.deleteMany();
  await prisma.wrappedReport.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.message.deleteMany();
  await prisma.post.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database wiped (except communities)");

  // 2. Create/Upsert Communities
  const communitiesData = [
    { name: 'College Night Owls', description: 'For those 3 AM study breaks' },
    { name: 'The Break Room', description: 'Corporate stress relief' },
    { name: 'Quitting Squad', description: 'Supporting each other to stop' },
  ]

  const communities = await Promise.all(
    communitiesData.map((data) =>
      prisma.community.upsert({
        where: { name: data.name },
        update: { description: data.description },
        create: data,
      })
    )
  )
  console.log(`Ensured ${communities.length} communities exist`)

  // 3. Create Users (Owner + Mock Users)
  const usersData = [
    { email: 'owner@smory.app', password: 'Password123!', anonymous_username: 'SmoryOwner', avatar_species: 'Owl' },
    { email: 'fox@smory.app', password: 'Password123!', anonymous_username: 'AshFox21', avatar_species: 'Fox' },
    { email: 'owl@smory.app', password: 'Password123!', anonymous_username: 'NightOwl99', avatar_species: 'Owl' },
    { email: 'dragon@smory.app', password: 'Password123!', anonymous_username: 'VapeLord12', avatar_species: 'Dragon' },
    { email: 'cat@smory.app', password: 'Password123!', anonymous_username: 'StressedOut', avatar_species: 'Cat' },
    { email: 'wolf@smory.app', password: 'Password123!', anonymous_username: 'Quitter99', avatar_species: 'Wolf' },
  ]

  const users = []
  
  for (const data of usersData) {
    let authUser;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (authError) {
      if ((authError as any).code === 'email_exists' || authError.message.includes('registered')) {
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        authUser = existingUsers?.users?.find(u => u.email === data.email);
      } else {
        console.error("Failed to create user", data.email, authError);
        continue;
      }
    } else {
      authUser = authData.user;
    }

    if (authUser) {
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

  console.log(`Created/Linked ${users.length} users in Supabase Auth & Prisma`)

  const ownerUser = users.find(u => u.anonymous_username === 'SmoryOwner');
  if (!ownerUser) {
    throw new Error("Owner user was not created!");
  }

  // 4. Seed the Welcome Feed Post
  const welcomePost = await prisma.post.create({
    data: {
      authorId: ownerUser.id,
      content: "Hello users! Welcome to Smory. Let's keep this space cozy, helpful, and support each other on our journeys. Feel free to say hello below and share your goals! 🚬❌",
    }
  });
  console.log('Created welcome post in feed')

  // 5. Seed Feed Comments (Replies) under the Welcome Post
  const repliesData = [
    { username: 'AshFox21', content: 'Hello! Excited to be here. Trying to limit my daily count.' },
    { username: 'NightOwl99', content: "Hey everyone, love the clean pixel UI here. Let's do this!" },
    { username: 'VapeLord12', content: 'Yo! Ready to quit the disposables. Nice to meet you all.' },
    { username: 'StressedOut', content: 'Hello owner! Already logged my first trigger. This is going to be useful.' },
    { username: 'Quitter99', content: 'Hey! Day 5 here and staying strong. Glad to have a supportive crew.' },
  ];

  for (const reply of repliesData) {
    const user = users.find(u => u.anonymous_username === reply.username);
    if (user) {
      await prisma.reply.create({
        data: {
          postId: welcomePost.id,
          userId: user.id,
          content: reply.content,
        }
      });
    }
  }
  console.log('Created replies under welcome post')

  // 6. Seed Standalone Feed Posts from Mock Users (as requested in feedback)
  const standalonePostsData = [
    { username: 'AshFox21', content: "Finally reached 24 hours smoke-free! The craving stats widget on the dashboard is super motivating." },
    { username: 'NightOwl99', content: "Late night study session. Usually, I'd have smoked half a pack by now, but I'm holding strong with green tea." },
    { username: 'VapeLord12', content: "Pro-tip for quitting: throw away all your empty pods/vapes. Out of sight, out of mind really works." },
    { username: 'StressedOut', content: "Work is crazy today, but I managed to log a craving trigger instead of actually going out. Progress." },
    { username: 'Quitter99', content: "Day 7 update: Taste and smell are starting to return. It's crazy how fast the body starts healing itself!" },
  ];

  for (const post of standalonePostsData) {
    const user = users.find(u => u.anonymous_username === post.username);
    if (user) {
      await prisma.post.create({
        data: {
          authorId: user.id,
          content: post.content,
        }
      });
    }
  }
  console.log('Created standalone posts in feed')

  // 7. Seed Community Memberships (Everyone joins all communities)
  for (const user of users) {
    for (const community of communities) {
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
      });
    }
  }
  console.log('Registered community memberships')

  // 8. Seed Community Conversations (Talks and chat messages)
  const collegeCommunity = communities.find(c => c.name === 'College Night Owls');
  const breakRoomCommunity = communities.find(c => c.name === 'The Break Room');
  const quittingSquadCommunity = communities.find(c => c.name === 'Quitting Squad');

  if (collegeCommunity) {
    const collegeMessages = [
      { username: 'NightOwl99', content: 'Anyone studying for finals right now? Need a virtual study partner.' },
      { username: 'AshFox21', content: 'Yes! I have a chemistry exam tomorrow. Going crazy.' },
      { username: 'NightOwl99', content: "Same, math here. Every time I get stuck on a proof, I reach for a smoke." },
      { username: 'AshFox21', content: "Ugh, tell me about it. I'm trying chewing gum instead tonight. It's... okay." },
      { username: 'VapeLord12', content: "Keep it up y'all. Take short walks instead. It actually helps clear the mind." },
    ];
    for (const msg of collegeMessages) {
      const user = users.find(u => u.anonymous_username === msg.username);
      if (user) {
        await prisma.message.create({
          data: {
            communityId: collegeCommunity.id,
            userId: user.id,
            content: msg.content,
          }
        });
      }
    }
  }

  if (breakRoomCommunity) {
    const breakRoomMessages = [
      { username: 'StressedOut', content: 'Just survived a 2-hour status meeting that could have been an email.' },
      { username: 'Quitter99', content: 'The classic. Did you run straight to the break room?' },
      { username: 'StressedOut', content: "Yep. Had to resist the urge. Logged a 'Stress' trigger in my profile instead!" },
      { username: 'Quitter99', content: 'Nice! That\'s a win. I had my coffee break without a smoke today too.' },
      { username: 'AshFox21', content: 'Congrats! The coffee break routine is the hardest one to break for me.' },
    ];
    for (const msg of breakRoomMessages) {
      const user = users.find(u => u.anonymous_username === msg.username);
      if (user) {
        await prisma.message.create({
          data: {
            communityId: breakRoomCommunity.id,
            userId: user.id,
            content: msg.content,
          }
        });
      }
    }
  }

  if (quittingSquadCommunity) {
    const quittingSquadMessages = [
      { username: 'Quitter99', content: 'Just reached week 1 smoke-free! Cravings are getting weaker.' },
      { username: 'VapeLord12', content: 'That\'s huge! Congrats. I\'m on day 3, hoping to get where you are.' },
      { username: 'NightOwl99', content: 'Awesome work. Let\'s keep the streak alive.' },
      { username: 'StressedOut', content: 'Inspirational! Whenever I get a craving, I\'ll look at your streak.' },
    ];
    for (const msg of quittingSquadMessages) {
      const user = users.find(u => u.anonymous_username === msg.username);
      if (user) {
        await prisma.message.create({
          data: {
            communityId: quittingSquadCommunity.id,
            userId: user.id,
            content: msg.content,
          }
        });
      }
    }
  }
  console.log('Seeded community chats/conversations')

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
