import type {
  Psychologist,
  PsychologistProps,
} from '@domain/account/enterprise/entities/psychologist'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import type { PrismaService } from '@infra/database/prisma'

import { PsychologistFactory } from './factories/make-psychologist'

interface CreateAuthenticateUserReponse {
  accessToken: string
  psychologist: Psychologist
}

export async function createAuthenticateUser(
  prisma: PrismaService,
  psychologistData: Partial<PsychologistProps> = {},
): Promise<CreateAuthenticateUserReponse> {
  const psychologistFactory = new PsychologistFactory(prisma)
  const hasher = new BcryptHasher()
  const encrypter = new JwtEncrypter()

  const password = '123456'

  const psychologist = await psychologistFactory.makePrismaPsychologist({
    ...psychologistData,
    passwordHash: await hasher.hash(psychologistData.passwordHash ?? password),
  })

  const accessToken = await encrypter.encrypt({ sub: psychologist.id })

  return { accessToken, psychologist }
}
