import { Patient } from '@domain/account/enterprise/entities/patient'
import type { Patient as RawPatient, Prisma } from '@prisma/client'

export class PrismaPatientMapper {
  /**
   * Converts an {@link Patient} object to a `Prisma.PatientUncheckedCreateInput` object.
   *
   * @param {Patient} patient - The {@link Patient} object to convert.
   * @return {Prisma.PatientUncheckedCreateInput} - The converted `Prisma.PatientUncheckedCreateInput` object.
   */
  static toPrisma(patient: Patient): Prisma.PatientUncheckedCreateInput {
    return {
      id: patient.id,
      psychologistId: patient.psychologistId,
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      occupation: patient.occupation,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    }
  }

  /**
   * Converts a Prisma raw Patient object into an {@link Patient} domain object.
   *
   * @param {RawPatient} raw - The Prisma raw Patient object to convert.
   * @return {Patient} - The converted {@link Patient} domain object.
   */
  static toDomain(raw: RawPatient): Patient {
    return Patient.create(
      {
        psychologistId: raw.psychologistId,
        fullName: raw.fullName,
        email: raw.email,
        phone: raw.phone,
        dateOfBirth: raw.dateOfBirth,
        occupation: raw.occupation,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
