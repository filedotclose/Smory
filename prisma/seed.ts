import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Users
  const usersData = [
    { anonymous_username: 'AshFox21', avatar_species: 'Fox' },
    { anonymous_username: 'NightOwl99', avatar_species: 'Owl' },
    { anonymous_username: 'VapeLord12', avatar_species: 'Dragon' },
    { anonymous_username: 'StressedOut', avatar_species: 'Cat' },
    { anonymous_username: 'Quitter99', avatar_species: 'Wolf' },
  ]

  const users = await Promise.all(
    usersData.map((data) =>
      prisma.user.upsert({
        where: { anonymous_username: data.anonymous_username },
        update: {},
        create: data,
      })
    )
  )

  console.log(`Created ${users.length} users`)

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
    const randomCommunity = communities[Math.floor(Math.random() * communities.length)]
    const randomContent = postContents[Math.floor(Math.random() * postContents.length)]

    await prisma.post.create({
      data: {
        authorId: randomUser.id,
        communityId: randomCommunity.id,
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
