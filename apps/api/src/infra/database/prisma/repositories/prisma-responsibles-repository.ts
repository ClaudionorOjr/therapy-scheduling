import type { ResponsiblesRepository } from '@domain/account/application/repositories/responsibles-repository'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'
import { inject, injectable } from 'tsyringe'

import { PrismaService } from '..'
import { PrismaResponsibleMapper } from '../mappers/prisma-responsible-mapper'

@injectable()
export class PrismaResponsiblesRepository implements ResponsiblesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(responsible: Responsible): Promise<void> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.responsible.create({ data })
  }

  async createMany(responsibles: Responsible[]): Promise<void> {
    await this.prisma.responsible.createMany({
      data: responsibles.map(PrismaResponsibleMapper.toPrisma),
    })
  }

  async findById(id: string): Promise<Responsible | null> {
    const responsible = await this.prisma.responsible.findUnique({
      where: { id },
    })

    if (!responsible) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(responsible)
  }

  async findManyByPatientId(patientId: string): Promise<Responsible[]> {
    const responsibles = await this.prisma.responsible.findMany({
      where: {
        patientId,
      },
    })

    return responsibles.map(PrismaResponsibleMapper.toDomain)
  }

  async save(responsible: Responsible): Promise<void> {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.responsible.update({
      where: { id: responsible.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.responsible.delete({
      where: { id },
    })
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prisma.responsible.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  }
}
