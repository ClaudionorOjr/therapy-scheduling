import type { PatientsRepository } from '@domain/account/application/repositories/patients-repository'
import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'
import type { ResponsiblesRepository } from '@domain/account/application/repositories/responsibles-repository'
import type { Encrypter } from '@domain/account/cryptography/encrypter'
import type { Hasher } from '@domain/account/cryptography/hasher'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { PrismaPatientsRepository } from '@infra/database/prisma/repositories/prisma-patients-repository'
import { PrismaResponsiblesRepository } from '@infra/database/prisma/repositories/prisma-responsibles-repository'
import { container } from 'tsyringe'

import { BcryptHasher } from '../cryptography/bcrypt-hasher'
import type { DatabaseProvider } from '../database/database-provider'
import { PrismaService } from '../database/prisma'
import { PrismaPsychologistsRepository } from '../database/prisma/repositories/prisma-psychologists-repository'

container.registerSingleton<DatabaseProvider>('Prisma', PrismaService)

container.registerSingleton<Hasher>('Hasher', BcryptHasher)

container.registerSingleton<Encrypter>('Encrypter', JwtEncrypter)

container.registerSingleton<PsychologistsRepository>(
  'PsychologistsRepository',
  PrismaPsychologistsRepository,
)

container.registerSingleton<PatientsRepository>(
  'PatientsRepository',
  PrismaPatientsRepository,
)

container.registerSingleton<ResponsiblesRepository>(
  'ResponsiblesRepository',
  PrismaResponsiblesRepository,
)
