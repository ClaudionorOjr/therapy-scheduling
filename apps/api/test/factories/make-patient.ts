import {
  Patient,
  type PatientProps,
} from '@domain/account/enterprise/entities/patient'
import { faker } from '@faker-js/faker'
import { PrismaPatientMapper } from '@infra/database/prisma/mappers/prisma-patient-mapper'
import type { PrismaClient } from '@prisma/client'

export function makePatient(override?: Partial<PatientProps>, id?: string) {
  return Patient.create(
    {
      psychologistId: faker.string.uuid(),
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number().toString(),
      dateOfBirth: faker.date.birthdate(),
      occupation: faker.person.jobType(),
      ...override,
    },
    id,
  )
}

export class PatientFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaPatient(data: Partial<PatientProps> = {}): Promise<Patient> {
    const patient = makePatient(data)

    await this.prisma.patient.create({
      data: PrismaPatientMapper.toPrisma(patient),
    })

    return patient
  }
}
