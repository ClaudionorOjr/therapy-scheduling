import type { PsychologistsRepository } from '@domain/account/application/repositories/psychologists-repository'
import type { Psychologist } from '@domain/account/enterprise/entities/psychologist'
import { inject, injectable } from 'tsyringe'

import type { PrismaService } from '..'
import { PrismaPsychologistMapper } from '../mappers/prisma-psychologist-mapper'

@injectable()
export class PrismaPsychologistsRepository implements PsychologistsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(psychologist: Psychologist): Promise<void> {
    const data = PrismaPsychologistMapper.toPrisma(psychologist)

    await this.prisma.psychologist.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Psychologist | null> {
    const psychologist = await this.prisma.psychologist.findUnique({
      where: { email },
    })

    if (!psychologist) {
      return null
    }

    return PrismaPsychologistMapper.toDomain(psychologist)
  }

  async findById(id: string): Promise<Psychologist | null> {
    const psychologist = await this.prisma.psychologist.findUnique({
      where: { id },
    })

    if (!psychologist) {
      return null
    }

    return PrismaPsychologistMapper.toDomain(psychologist)
  }

  async save(psychologist: Psychologist): Promise<void> {
    const data = PrismaPsychologistMapper.toPrisma(psychologist)

    await this.prisma.psychologist.update({
      where: { id: psychologist.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.psychologist.delete({
      where: { id },
    })
  }
}
