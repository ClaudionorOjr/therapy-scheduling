import {
  Psychologist,
  type PsychologistProps,
} from '@domain/account/enterprise/entities/psychologist'
import { faker } from '@faker-js/faker'
import { PrismaPsychologistMapper } from '@infra/database/prisma/mappers/prisma-psychologist-mapper'
import type { PrismaClient } from '@prisma/client'

export function makePsychologist(
  override?: Partial<PsychologistProps>,
  id?: string,
): Psychologist {
  return Psychologist.create(
    {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      phone: faker.phone.number().toString(),
      dateOfBirth: faker.date.birthdate(),
      crp: faker.number.int({ min: 100000, max: 999999 }).toString(),
      ...override,
    },
    id,
  )
}

export class PsychologistFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaPsychologist(
    data: Partial<PsychologistProps> = {},
  ): Promise<Psychologist> {
    const psychologist = makePsychologist(data)

    await this.prisma.psychologist.create({
      data: PrismaPsychologistMapper.toPrisma(psychologist),
    })

    return psychologist
  }
}
