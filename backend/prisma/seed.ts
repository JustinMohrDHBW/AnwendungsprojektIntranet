import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // First clear existing users
  await prisma.user.deleteMany({})

  // Create users
  const users = [
    {
      username: 'admin',
      password: 'admin',
      firstName: 'Justin',
      lastName: 'Mohr',
      role: Role.ADMIN,
      personalnummer: 'A001',
      abteilung: 'Management'
    },
    {
      username: 'john-doe',
      password: 'john-doe',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      personalnummer: 'E001',
      abteilung: 'Development'
    },
    {
      username: 'emma-schmidt',
      password: 'emma-schmidt',
      firstName: 'Emma',
      lastName: 'Schmidt',
      role: Role.USER,
      personalnummer: 'E002',
      abteilung: 'Design'
    },
    {
      username: 'max-mueller',
      password: 'max-mueller',
      firstName: 'Max',
      lastName: 'Müller',
      role: Role.USER,
      personalnummer: 'E003',
      abteilung: 'Marketing'
    },
    {
      username: 'laura-wagner',
      password: 'laura-wagner',
      firstName: 'Laura',
      lastName: 'Wagner',
      role: Role.USER,
      personalnummer: 'E004',
      abteilung: 'Sales'
    },
    {
      username: 'thomas-weber',
      password: 'thomas-weber',
      firstName: 'Thomas',
      lastName: 'Weber',
      role: Role.USER,
      personalnummer: 'E005',
      abteilung: 'Development'
    },
    {
      username: 'anna-becker',
      password: 'anna-becker',
      firstName: 'Anna',
      lastName: 'Becker',
      role: Role.USER,
      personalnummer: 'E006',
      abteilung: 'HR'
    },
    {
      username: 'michael-klein',
      password: 'michael-klein',
      firstName: 'Michael',
      lastName: 'Klein',
      role: Role.USER,
      personalnummer: 'E007',
      abteilung: 'Finance'
    },
    {
      username: 'sarah-wolf',
      password: 'sarah-wolf',
      firstName: 'Sarah',
      lastName: 'Wolf',
      role: Role.USER,
      personalnummer: 'E008',
      abteilung: 'Design'
    },
    {
      username: 'david-fischer',
      password: 'david-fischer',
      firstName: 'David',
      lastName: 'Fischer',
      role: Role.USER,
      personalnummer: 'E009',
      abteilung: 'Development'
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  console.log('Database has been seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 