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
      abteilung: 'Management',
      phone: '+49 176 1234567'
    },
    {
      username: 'john-doe',
      password: 'john-doe',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
      personalnummer: 'E001',
      abteilung: 'Development',
      phone: '+49 176 2345678'
    },
    {
      username: 'emma-schmidt',
      password: 'emma-schmidt',
      firstName: 'Emma',
      lastName: 'Schmidt',
      role: Role.USER,
      personalnummer: 'E002',
      abteilung: 'Design',
      phone: '+49 176 3456789'
    },
    {
      username: 'max-mueller',
      password: 'max-mueller',
      firstName: 'Max',
      lastName: 'Müller',
      role: Role.USER,
      personalnummer: 'E003',
      abteilung: 'Marketing',
      phone: '+49 176 4567890'
    },
    {
      username: 'laura-wagner',
      password: 'laura-wagner',
      firstName: 'Laura',
      lastName: 'Wagner',
      role: Role.USER,
      personalnummer: 'E004',
      abteilung: 'Sales',
      phone: '+49 176 5678901'
    },
    {
      username: 'thomas-weber',
      password: 'thomas-weber',
      firstName: 'Thomas',
      lastName: 'Weber',
      role: Role.USER,
      personalnummer: 'E005',
      abteilung: 'Development',
      phone: '+49 176 6789012'
    },
    {
      username: 'anna-becker',
      password: 'anna-becker',
      firstName: 'Anna',
      lastName: 'Becker',
      role: Role.USER,
      personalnummer: 'E006',
      abteilung: 'HR',
      phone: '+49 176 7890123'
    },
    {
      username: 'michael-klein',
      password: 'michael-klein',
      firstName: 'Michael',
      lastName: 'Klein',
      role: Role.USER,
      personalnummer: 'E007',
      abteilung: 'Finance',
      phone: '+49 176 8901234'
    },
    {
      username: 'sarah-wolf',
      password: 'sarah-wolf',
      firstName: 'Sarah',
      lastName: 'Wolf',
      role: Role.USER,
      personalnummer: 'E008',
      abteilung: 'Design',
      phone: '+49 176 9012345'
    },
    {
      username: 'david-fischer',
      password: 'david-fischer',
      firstName: 'David',
      lastName: 'Fischer',
      role: Role.USER,
      personalnummer: 'E009',
      abteilung: 'Development',
      phone: '+49 176 0123456'
    },
    {
      username: 'lisa-meyer',
      password: 'lisa-meyer',
      firstName: 'Lisa',
      lastName: 'Meyer',
      role: Role.USER,
      personalnummer: 'E010',
      abteilung: 'Product',
      phone: '+49 176 1234567'
    },
    {
      username: 'peter-schulz',
      password: 'peter-schulz',
      firstName: 'Peter',
      lastName: 'Schulz',
      role: Role.USER,
      personalnummer: 'E011',
      abteilung: 'Development',
      phone: '+49 176 2345678'
    },
    {
      username: 'julia-hoffmann',
      password: 'julia-hoffmann',
      firstName: 'Julia',
      lastName: 'Hoffmann',
      role: Role.USER,
      personalnummer: 'E012',
      abteilung: 'UX Design',
      phone: '+49 176 3456789'
    },
    {
      username: 'markus-koch',
      password: 'markus-koch',
      firstName: 'Markus',
      lastName: 'Koch',
      role: Role.USER,
      personalnummer: 'E013',
      abteilung: 'Sales',
      phone: '+49 176 4567890'
    },
    {
      username: 'nina-richter',
      password: 'nina-richter',
      firstName: 'Nina',
      lastName: 'Richter',
      role: Role.USER,
      personalnummer: 'E014',
      abteilung: 'Marketing',
      phone: '+49 176 5678901'
    },
    {
      username: 'felix-bauer',
      password: 'felix-bauer',
      firstName: 'Felix',
      lastName: 'Bauer',
      role: Role.USER,
      personalnummer: 'E015',
      abteilung: 'Development',
      phone: '+49 176 6789012'
    },
    {
      username: 'sophia-lang',
      password: 'sophia-lang',
      firstName: 'Sophia',
      lastName: 'Lang',
      role: Role.USER,
      personalnummer: 'E016',
      abteilung: 'Product',
      phone: '+49 176 7890123'
    },
    {
      username: 'tim-zimmermann',
      password: 'tim-zimmermann',
      firstName: 'Tim',
      lastName: 'Zimmermann',
      role: Role.USER,
      personalnummer: 'E017',
      abteilung: 'UX Design',
      phone: '+49 176 8901234'
    },
    {
      username: 'hannah-krause',
      password: 'hannah-krause',
      firstName: 'Hannah',
      lastName: 'Krause',
      role: Role.USER,
      personalnummer: 'E018',
      abteilung: 'HR',
      phone: '+49 176 9012345'
    },
    {
      username: 'lukas-werner',
      password: 'lukas-werner',
      firstName: 'Lukas',
      lastName: 'Werner',
      role: Role.USER,
      personalnummer: 'E019',
      abteilung: 'Finance',
      phone: '+49 176 0123456'
    },
    {
      username: 'marie-schwarz',
      password: 'marie-schwarz',
      firstName: 'Marie',
      lastName: 'Schwarz',
      role: Role.USER,
      personalnummer: 'E020',
      abteilung: 'Development',
      phone: '+49 176 1122334'
    },
    {
      username: 'alexander-vogel',
      password: 'alexander-vogel',
      firstName: 'Alexander',
      lastName: 'Vogel',
      role: Role.USER,
      personalnummer: 'E021',
      abteilung: 'Product',
      phone: '+49 176 2233445'
    },
    {
      username: 'sophie-neumann',
      password: 'sophie-neumann',
      firstName: 'Sophie',
      lastName: 'Neumann',
      role: Role.USER,
      personalnummer: 'E022',
      abteilung: 'UX Design',
      phone: '+49 176 3344556'
    },
    {
      username: 'jan-hartmann',
      password: 'jan-hartmann',
      firstName: 'Jan',
      lastName: 'Hartmann',
      role: Role.USER,
      personalnummer: 'E023',
      abteilung: 'Development',
      phone: '+49 176 4455667'
    },
    {
      username: 'lena-schreiber',
      password: 'lena-schreiber',
      firstName: 'Lena',
      lastName: 'Schreiber',
      role: Role.USER,
      personalnummer: 'E024',
      abteilung: 'Marketing',
      phone: '+49 176 5566778'
    },
    {
      username: 'tobias-frank',
      password: 'tobias-frank',
      firstName: 'Tobias',
      lastName: 'Frank',
      role: Role.USER,
      personalnummer: 'E025',
      abteilung: 'Sales',
      phone: '+49 176 6677889'
    },
    {
      username: 'clara-berg',
      password: 'clara-berg',
      firstName: 'Clara',
      lastName: 'Berg',
      role: Role.USER,
      personalnummer: 'E026',
      abteilung: 'Design',
      phone: '+49 176 7788990'
    },
    {
      username: 'sebastian-keller',
      password: 'sebastian-keller',
      firstName: 'Sebastian',
      lastName: 'Keller',
      role: Role.USER,
      personalnummer: 'E027',
      abteilung: 'Development',
      phone: '+49 176 8899001'
    },
    {
      username: 'katharina-huber',
      password: 'katharina-huber',
      firstName: 'Katharina',
      lastName: 'Huber',
      role: Role.USER,
      personalnummer: 'E028',
      abteilung: 'HR',
      phone: '+49 176 9900112'
    },
    {
      username: 'philip-schubert',
      password: 'philip-schubert',
      firstName: 'Philip',
      lastName: 'Schubert',
      role: Role.USER,
      personalnummer: 'E029',
      abteilung: 'Finance',
      phone: '+49 176 0011223'
    },
    {
      username: 'elena-winter',
      password: 'elena-winter',
      firstName: 'Elena',
      lastName: 'Winter',
      role: Role.USER,
      personalnummer: 'E030',
      abteilung: 'Product',
      phone: '+49 176 1122334'
    },
    {
      username: 'moritz-baumann',
      password: 'moritz-baumann',
      firstName: 'Moritz',
      lastName: 'Baumann',
      role: Role.USER,
      personalnummer: 'E031',
      abteilung: 'Development',
      phone: '+49 176 2233445'
    },
    {
      username: 'victoria-sauer',
      password: 'victoria-sauer',
      firstName: 'Victoria',
      lastName: 'Sauer',
      role: Role.USER,
      personalnummer: 'E032',
      abteilung: 'UX Design',
      phone: '+49 176 3344556'
    }
  ]

  for (const user of users) {
    await prisma.user.create({
      data: user
    })
  }

  console.log('Database has been seeded with', users.length, 'users')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 