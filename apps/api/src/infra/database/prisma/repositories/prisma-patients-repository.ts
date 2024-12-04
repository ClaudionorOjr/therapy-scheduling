import type { PatientsRepository } from '@domain/account/application/repositories/patients-repository'
import type { Patient } from '@domain/account/enterprise/entities/patient'
import type { Responsible } from '@domain/account/enterprise/entities/responsible'
import { inject, injectable } from 'tsyringe'

import type { PrismaService } from '..'
import { PrismaPatientMapper } from '../mappers/prisma-patient-mapper'

@injectable()
export class PrismaPatientsRepository implements PatientsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(patient: Patient, responsibles: Responsible[]): Promise<void> {
    const data = PrismaPatientMapper.toPrisma(patient)

    await this.prisma.patient.create({
      data: {
        ...data,
        responsibles: {
          createMany: {
            data: responsibles.map((responsible) => {
              return {
                fullName: responsible.fullName,
                email: responsible.email,
                phone: responsible.phone,
                degreeOfKinship: responsible.degreeOfKinship,
              }
            }),
          },
        },
      },
    })
  }

  async findByPsychologistIdEmailAndFullName(
    psychologistId: string,
    email: string,
    fullName: string,
  ): Promise<Patient | null> {
    const patient = await this.prisma.patient.findFirst({
      where: {
        psychologistId,
        email,
        fullName,
      },
    })

    if (!patient) {
      return null
    }

    return PrismaPatientMapper.toDomain(patient)
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    })

    if (!patient) {
      return null
    }

    return PrismaPatientMapper.toDomain(patient)
  }

  async findManyByPsychologistId(psychologistId: string): Promise<Patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: {
        psychologistId,
      },
    })

    return patients.map(PrismaPatientMapper.toDomain)
  }

  async save(patient: Patient): Promise<void> {
    const data = PrismaPatientMapper.toPrisma(patient)

    await this.prisma.patient.update({
      where: {
        id: patient.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.delete({
      where: { id },
    })
  }
}
